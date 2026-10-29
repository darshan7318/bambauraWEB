# ==============================================================================
# Bambaura 9X Storefront — Hostinger Production Dockerfile
# Ultra-lightweight Nginx container for React SPA
# ==============================================================================

# Stage 1: Build React Production Bundle
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve via Nginx Alpine (~25MB Image)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default files and copy built production artifacts
RUN rm -rf ./*
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
