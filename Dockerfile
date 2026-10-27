# Multi-stage Dockerfile for FairShift (Vite build -> nginx:alpine)
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . ./
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

ENV PORT=8080
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d

# Copy template for dynamic $PORT substitution (serves on 0.0.0.0:${PORT:-8080})
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
