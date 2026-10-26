#!/bin/sh
# Backup periodico di PostgreSQL (formato custom, già compresso).
# Ripristino: scripts/restore.sh backups/<file>.dump
set -eu

KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"
export PGPASSWORD="${POSTGRES_PASSWORD}"

mkdir -p /backups
echo "[backup] attivo: ogni ${INTERVAL}s, conservo ${KEEP_DAYS} giorni"

while true; do
  ts="$(date +%Y%m%d-%H%M%S)"
  file="/backups/${POSTGRES_DB}-${ts}.dump"
  if pg_dump -h db -U "${POSTGRES_USER}" -Fc -f "${file}.tmp" "${POSTGRES_DB}"; then
    mv "${file}.tmp" "${file}"
    echo "[backup] ok: ${file}"
  else
    rm -f "${file}.tmp"
    echo "[backup] ERRORE durante pg_dump" >&2
  fi
  find /backups -name '*.dump' -mtime +"${KEEP_DAYS}" -delete
  sleep "${INTERVAL}"
done
