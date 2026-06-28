# Multi-Container App — Kubernetes Deployment

A multi-container application (`client`, `server`, `worker`, `postgres`, `redis`) running on Kubernetes — locally on Docker Desktop for development, and on DigitalOcean Kubernetes Service (DOKS) for production.

**Stack:** React/Vite (client) · Node/Express (server) · background job worker · PostgreSQL · Redis

---

## Architecture

```
                    ┌─────────────────┐
   Browser  ──────► │  client-service │  (exposed externally)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  server-service │  (ClusterIP :5001)
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼                              ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ postgres-service  │          │  redis-service    │
    │  (ClusterIP :5432)│          │  (ClusterIP :6379) │
    └──────────────────┘          └──────────────────┘
                                            ▲
                                  ┌──────────────────┐
                                  │ worker-deployment │ (no Service —
                                  │   (background)    │  calls Redis only)
                                  └──────────────────┘
```

- **client** — only externally-facing piece
- **server**, **postgres**, **redis** — internal only (`ClusterIP`)
- **worker** — background job processor, no Service object (outbound to Redis only)

All manifests live in `k8s/`, one `[service]-deployment.yaml` + `[service]-service.yaml` pair per service.

---

## Prerequisites

- Docker Desktop with Kubernetes enabled
- `kubectl`
- `helm` (production only) — `brew install helm`

---

## Local Development

### 1. Build images

```bash
docker build -t k8s-multi-container-app-ui:dev     -f ./client/Dockerfile.dev ./client
docker build -t k8s-multi-container-app-api:dev     -f ./server/Dockerfile.dev ./server
docker build -t k8s-multi-container-app-worker:dev  -f ./worker/Dockerfile.dev ./worker
```

Postgres and Redis use official public images — no build needed.

### 2. Apply manifests

```bash
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-persistent-volume-claim.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/redis-service.yaml
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/server-service.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/client-service.yaml
kubectl apply -f k8s/ingress.yaml
```

Or apply everything at once — Kubernetes reconciles regardless of order:

```bash
kubectl apply -f k8s/
```

### 3. Enable the Ingress Controller (one-time, per cluster)

Docker Desktop's local Kubernetes doesn't ship with an Ingress Controller — install it once:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.3/deploy/static/provider/cloud/deploy.yaml
kubectl get pods -n ingress-nginx   # wait for ingress-nginx-controller: Running
```

### 4. Access the app

```
http://localhost/         → client
http://localhost/api/...  → server
```

### Useful commands

```bash
kubectl get pods                          # check status
kubectl describe pod <pod-name>           # debug a stuck/crashing pod
kubectl logs <pod-name>                   # app logs
kubectl exec -it <pod-name> -- /bin/sh    # shell into a container
kubectl rollout restart deployment/<name> # force re-pull after a new :latest push
```

---

## CI/CD

`.github/workflows/deploy.yaml` runs on every push to `master`:

1. **`test-and-verify`** — type-check, test, and sanity-build all three services
2. **`build-and-push`** _(only on push to `master`, gated on step 1 passing)_ — builds multi-arch (`amd64`/`arm64`) images and pushes to Docker Hub under both `:latest` and `:<commit-sha>`

The client build passes `VITE_API_BASE_URL=/api` as a Docker **build arg**, since Vite inlines `VITE_*` env vars into the static bundle at build time — setting it as a runtime Kubernetes env var has no effect on a pre-built static image.

Local manifests pull these images directly:

```yaml
image: abahal/k8s-multi-container-app-ui:latest
imagePullPolicy: Always
```

---

## Production (DigitalOcean Kubernetes)

### Install the Ingress Controller via Helm

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install absolute-router ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

kubectl get services -n ingress-nginx   # wait for EXTERNAL-IP to assign
```

### Deploy pipeline

The deploy stage (`deploy-to-doks` job) authenticates to DigitalOcean, applies manifests, then forces a rolling update tagged with the Git commit SHA — guaranteeing every deploy pulls the exact new image, unlike relying on `:latest` alone:

```bash
doctl kubernetes cluster kubeconfig save learning-k8s-cluster
kubectl apply -f k8s/
kubectl set image deployment/server-deployment server=<image>:<github.sha>
kubectl set image deployment/client-deployment client=<image>:<github.sha>
kubectl set image deployment/worker-deployment worker=<image>:<github.sha>
```

Postgres storage uses DigitalOcean's block storage class in production instead of local `hostpath`:

```yaml
storageClassName: do-block-storage
```

### Teardown (avoid ongoing billing)

```bash
helm uninstall absolute-router -n ingress-nginx
kubectl delete -f k8s/
```

Then in the DigitalOcean dashboard: **Kubernetes → select cluster → Destroy**, making sure to tick **Associated Load Balancers** and **Associated Volumes** in the deletion modal. Verify Storage → Volumes and Networking → Load Balancers are both empty afterward.

---

## Configuration

**ConfigMap (`k8s/config.yaml`)** — non-sensitive shared values (DB host/port, Redis host/port, etc.), injected via `configMapKeyRef`. Note `PG_HOST` and `REDIS_HOST` are Service names, not IPs — Kubernetes' internal DNS resolves them automatically.

**Secret (`k8s/secrets.yaml`)** — base64-encoded Postgres password, injected via `secretKeyRef`. Stored under two keys (`POSTGRES_PASSWORD`, `PG_PASSWORD`) for the same value, since the official Postgres image and the app code expect different variable names.

---

## Notes & Gotchas

- **Postgres `replicas` must stay at `1`.** The PVC is `ReadWriteOnce` — a second pod can't mount it, and Postgres needs real replication (not just more pods) to scale.
- **Worker has no Service.** It only makes outbound calls to Redis; nothing calls it.
- **`imagePullPolicy: Always` + `:latest` doesn't auto-refresh running pods.** After pushing a new image, run `kubectl rollout restart deployment/<name>` to force a re-pull.
- **`VITE_API_BASE_URL` is build-time only.** It's baked into the static bundle when the image is built — it can't be changed via a runtime Kubernetes env var.
