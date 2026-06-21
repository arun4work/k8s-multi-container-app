# --- Stage 1: The Builder ---
FROM node:24-alpine AS builder

# Set working directry
WORKDIR /app

# Copy BOTH files for the lockfile sync
COPY package*.json ./

# 1. Install EVERYTHING (including devDependencies like tsc)
RUN npm ci 

COPY . .

# 2. Compile the code (Creates the /app/dist folder)
RUN npm run build

# --- Stage 2: The Production Image ---
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./

# 3. Install ONLY production dependencies (no tsc, no types)
# This keeps your final image small and secure
RUN npm ci --omit=dev

# 4. COPY the compiled 'dist' folder from the builder stage
COPY --from=builder /app/dist /app/dist

# 5. Run the app directly with node (Best practice for signals)
CMD ["node", "/app/dist/index.js"]
