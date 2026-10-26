#!/usr/bin/env sh
# Deploy in produzione sulla VM. Uso: sh scripts/deploy.sh
set -eu
cd "$(dirname "$0")/.."

[ -f .env.prod ] || { echo "Manca .env.prod (copia .env.prod.example e compilalo)"; exit 1; }
C="docker compose -f docker-compose.prod.yml --env-file .env.prod"

git pull --ff-only
$C build
$C up -d db
# Migrazioni con la nuova immagine PRIMA di sostituire i container applicativi
$C run --rm api php artisan migrate --force
$C up -d
$C exec -T api php artisan config:cache
$C exec -T api php artisan route:cache
$C exec -T api php artisan view:cache
$C restart queue
$C ps
echo "Deploy completato."
