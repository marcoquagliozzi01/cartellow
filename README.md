# Cartellow – webapp ordini (Laravel + React + PostgreSQL)

Vetrina per i clienti (accesso via email, senza password) e back-office per gestire
ordini, pagamenti (manuali), consegne e statistiche.

```
Internet → Caddy (HTTPS, reverse proxy)
              ├─ /           → React (build statica)
              └─ /api        → Laravel (PHP-FPM)
                                 └─ PostgreSQL (volume persistente)
```

## Requisiti
Docker + Docker Compose v2, `make`, `git`. Su Windows usa WSL2.

## Avvio rapido (sviluppo)

```bash
make init     # crea .env, installa Laravel e React/Vite/Tailwind, avvia tutto
```

| Cosa | URL |
|---|---|
| App (frontend + API) | http://localhost:8080 |
| Health check Laravel | http://localhost:8080/up |
| Email di test (Mailpit) | http://localhost:8025 |
| PostgreSQL (client DB) | 127.0.0.1:5432 (utente/password in `.env`) |

Comandi utili: `make help`, `make up`, `make down`, `make logs`, `make shell`,
`make artisan ARGS="migrate:status"`, `make composer ARGS="require pacchetto"`,
`make npm ARGS="install axios"`, `make test`.

> `make init` automatizza comandi che dipendono da Internet (Composer, npm). Se Vite
> ti pone domande interattive, rispondi di **non** usare opzioni sperimentali e di
> **non** avviare subito il server.

## Struttura

```
backend/    Laravel (generato da make init)
frontend/   React + Vite + Tailwind (generato da make init)
docker/     Dockerfile PHP/Caddy, Caddyfile dev e prod, script di backup
scripts/    init.sh, deploy.sh, restore.sh
docker-compose.yml        sviluppo
docker-compose.prod.yml   produzione
```

Differenze dev/prod: in dev il codice è montato come volume con hot reload e le email vanno
a Mailpit; in prod il codice è dentro l'immagine, HTTPS è automatico, le email partono da
una coda (servizio `queue`) e c'è il servizio `backup`.

## Produzione (VM con Docker)

1. Sulla VM: installa Docker, clona il repository.
2. `cp .env.prod.example .env.prod` e compila tutto (dominio, password DB, SMTP).
   Per `APP_KEY` genera una chiave con:
   `docker run --rm php:8.3-cli php -r 'echo "base64:".base64_encode(random_bytes(32)), PHP_EOL;'`
   e incollala in `.env.prod`. Compose rifiuta di partire se mancano i valori obbligatori.
3. Punta il DNS del dominio all'IP della VM e apri le porte 80 e 443 (anche nel firewall del provider).
4. `sh scripts/deploy.sh`

> Prima del primo deploy `backend/composer.lock` e `frontend/package-lock.json` devono
> essere nel repository (li generano `make init` e `composer`/`npm`): i Dockerfile di produzione li richiedono.

### Backup (importante)
Il servizio `backup` crea un dump giornaliero in `./backups` e tiene gli ultimi
`BACKUP_KEEP_DAYS` giorni. **Se restano solo sulla VM non sono un vero backup**: se la VM
viene eliminata o recuperata dal provider, spariscono anche loro. Sincronizza la cartella
all'esterno (es. con `rclone` da cron verso Backblaze B2, Cloudflare R2 o Google Drive).
Ripristino: `sh scripts/restore.sh backups/<file>.dump`.
**Fai un ripristino di prova prima del lancio.**

## Prossimi passi (roadmap)
Fase 2: migrazioni (clienti, prodotti, ordini, pagamenti, consegne), autenticazione cliente
via email con token a 30 giorni, login admin, macchina a stati dell'ordine.

## Note
- Il file `backend/.env` creato da Laravel viene sovrascritto dalle variabili d'ambiente
  definite in `docker-compose.yml` (DB, mail, ecc.), quindi in dev non serve modificarlo.
- Le immagini/file caricati dagli utenti (es. foto prodotto) richiederanno una configurazione
  aggiuntiva di Caddy per servire `storage/`: da fare quando servirà.
