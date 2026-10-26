# syntax=docker/dockerfile:1

# 1) Build del frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Caddy serve il build statico e fa da reverse proxy verso PHP-FPM
FROM caddy:2-alpine
COPY docker/caddy/Caddyfile.prod /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
