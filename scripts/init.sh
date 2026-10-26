#!/usr/bin/env sh
# Inizializza il progetto: crea Laravel + React/Vite dentro i container.
# Uso: make init   (oppure: sh scripts/init.sh)
set -eu
cd "$(dirname "$0")/.."

echo "==> 1/6  File .env"
if [ ! -f .env ]; then
  sed -e "s/^HOST_UID=.*/HOST_UID=$(id -u)/" \
      -e "s/^HOST_GID=.*/HOST_GID=$(id -g)/" .env.example > .env
  echo "    creato .env"
else
  echo "    .env già presente"
fi
# Le cartelle devono esistere PRIMA di docker, altrimenti Docker le crea come root
mkdir -p backend frontend backups

echo "==> 2/6  Build immagine PHP"
docker compose build api

echo "==> 3/6  Laravel"
if [ -f backend/artisan ]; then
  echo "    backend già inizializzato, salto"
else
  docker compose run --rm --no-deps -u "$(id -u):$(id -g)" api sh -c \
    'composer create-project laravel/laravel _app --no-interaction && cp -a _app/. . && rm -rf _app'
fi

echo "==> 4/6  Database + API (Sanctum) + migrazioni"
docker compose up -d --wait db
docker compose run --rm -u "$(id -u):$(id -g)" api php artisan install:api --no-interaction || true
docker compose run --rm -u "$(id -u):$(id -g)" api php artisan migrate --force

echo "==> 5/6  React + Vite + Tailwind"
if [ -f frontend/package.json ]; then
  echo "    frontend già inizializzato, salto"
else
  echo "    (se Vite fa domande interattive: scegli di NON usare rolldown/sperimentali e NON avviare subito)"
  docker compose run --rm --no-deps web sh -c \
    'npm create vite@latest _app -- --template react && cp -a _app/. . && rm -rf _app && npm install && npm install tailwindcss @tailwindcss/vite'

  cat > frontend/vite.config.js <<'VITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In sviluppo il browser parla con Caddy (porta APP_PORT) che inoltra a Vite:
// clientPort serve perché l'hot reload (websocket) passi dal proxy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    hmr: { clientPort: Number(process.env.APP_PORT || 8080) },
    // Se sviluppi su Windows/macOS e l'hot reload non scatta, decommenta:
    // watch: { usePolling: true },
  },
})
VITE

  if ! grep -q 'tailwindcss' frontend/src/index.css; then
    { printf '@import "tailwindcss";\n\n'; cat frontend/src/index.css; } > frontend/src/index.css.new
    mv frontend/src/index.css.new frontend/src/index.css
  fi
fi

echo "==> 6/6  Avvio"
docker compose up -d

PORT="$(grep '^APP_PORT=' .env | cut -d= -f2)"
echo ""
echo "Fatto!"
echo "  App:      http://localhost:${PORT:-8080}"
echo "  API test: http://localhost:${PORT:-8080}/up"
echo "  Email:    http://localhost:8025   (Mailpit)"
