# Equivalente di scripts/init.sh per Windows (PowerShell).
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\init.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Step([scriptblock]$cmd) {
  & $cmd
  if ($LASTEXITCODE -ne 0) { throw "Comando fallito: $cmd" }
}
function Write-LF([string]$path, [string]$content) {
  $full = Join-Path (Get-Location).Path $path
  $text = ($content -replace "`r`n", "`n")
  [System.IO.File]::WriteAllText($full, $text, (New-Object System.Text.UTF8Encoding($false)))
}

Write-Host "==> 1/6  File .env"
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host "    creato .env" }
else { Write-Host "    .env gia presente" }
New-Item -ItemType Directory -Force backend, frontend, backups | Out-Null

Write-Host "==> 2/6  Build immagine PHP"
Step { docker compose build api }

Write-Host "==> 3/6  Laravel"
if (Test-Path backend/artisan) { Write-Host "    backend gia inizializzato, salto" }
else {
  Step { docker compose run --rm --no-deps -u 1000:1000 api sh -c "composer create-project laravel/laravel _app --no-interaction && cp -a _app/. . && rm -rf _app" }
}

Write-Host "==> 4/6  Database + API (Sanctum) + migrazioni"
Step { docker compose up -d --wait db }
docker compose run --rm -u 1000:1000 api php artisan install:api --no-interaction
Step { docker compose run --rm -u 1000:1000 api php artisan migrate --force }

Write-Host "==> 5/6  React + Vite + Tailwind"
if (Test-Path frontend/package.json) { Write-Host "    frontend gia inizializzato, salto" }
else {
  Write-Host "    (se Vite fa domande: NON usare opzioni sperimentali e NON avviare subito)"
  Step { docker compose run --rm --no-deps web sh -c "npm create vite@latest _app -- --template react && cp -a _app/. . && rm -rf _app && npm install && npm install tailwindcss @tailwindcss/vite" }

  $vite = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In sviluppo il browser parla con Caddy (porta APP_PORT) che inoltra a Vite:
// clientPort serve perche l'hot reload (websocket) passi dal proxy.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    hmr: { clientPort: Number(process.env.APP_PORT || 8080) },
    // Su Windows l'hot reload spesso richiede il polling:
    watch: { usePolling: true },
  },
})
'@
  Write-LF "frontend/vite.config.js" $vite

  $css = Get-Content frontend/src/index.css -Raw
  if ($css -notmatch 'tailwindcss') {
    Write-LF "frontend/src/index.css" ("@import `"tailwindcss`";`n`n" + $css)
  }
}

Write-Host "==> 6/6  Avvio"
Step { docker compose up -d }

Write-Host ""
Write-Host "Fatto!"
Write-Host "  App:      http://localhost:8080"
Write-Host "  API test: http://localhost:8080/up"
Write-Host "  Email:    http://localhost:8025   (Mailpit)"
