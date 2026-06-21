# STAGE 1: Build the React/Vite application
# Pull Base Image
FROM node:24-alpine as builder

# Working directory
WORKDIR '/app'

# COPY code
COPY . .

# npm install
RUN npm ci

# Build code
# 1. Receive the value from Docker Compose / GitHub Actions
ARG VITE_API_BASE_URL

# 2. Convert that "Argument" into an "Environment Variable" 
# so that the 'npm run build' process can actually "see" it.
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 3. Vite now finds VITE_API_BASE_URL in the environment 
# and replaces 'import.meta.env.VITE_API_BASE_URL' with the real URL.
RUN npm run build


# STAGE 2: Serve the application with Nginx
FROM nginx

# Copy the build output from the previous stage to Nginx's serving directory
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Copy a custom Nginx configuration to handle SPA routing (crucial for React/Vite)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port to listen
EXPOSE 3000
