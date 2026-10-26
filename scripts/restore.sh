#!/usr/bin/env sh
# Ripristina un backup in produzione. ATTENZIONE: sovrascrive i dati attuali.
# Uso: sh scripts/restore.sh backups/cartellow-YYYYMMDD-HHMMSS.dump
set -eu
cd "$(dirname "$0")/.."

FILE="${1:?Uso: sh scripts/restore.sh backups/<file>.dump}"
[ -f "$FILE" ] || { echo "File non trovato: $FILE"; exit 1; }
C="docker compose -f docker-compose.prod.yml --env-file .env.prod"

printf "Questo SOVRASCRIVE il database. Scrivi 'si' per continuare: "
read -r ans
[ "$ans" = "si" ] || { echo "Annullato."; exit 1; }

# Carica le variabili del DB da .env.prod
set -a; . ./.env.prod; set +a

$C stop api queue
$C exec -T db pg_restore -U "$DB_USERNAME" -d "$DB_DATABASE" --clean --if-exists --no-owner < "$FILE"
$C start api queue
echo "Ripristino completato."
