DC = docker compose
USER_ID = $(shell id -u):$(shell id -g)
ARGS ?=

.PHONY: help init up down logs ps shell artisan composer npm migrate fresh test reset

.DEFAULT_GOAL := help

help: ## mostra i comandi
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

init: ## prima installazione (Laravel + React)
	sh scripts/init.sh

up: ## avvia l'ambiente
	$(DC) up -d

down: ## ferma l'ambiente
	$(DC) down

logs: ## log in tempo reale
	$(DC) logs -f --tail=100

ps: ## stato dei container
	$(DC) ps

shell: ## shell nel container PHP
	$(DC) exec -u $(USER_ID) api sh

artisan: ## es: make artisan ARGS="migrate:status"
	$(DC) exec -u $(USER_ID) api php artisan $(ARGS)

composer: ## es: make composer ARGS="require foo/bar"
	$(DC) exec -u $(USER_ID) api composer $(ARGS)

npm: ## es: make npm ARGS="install axios"
	$(DC) exec web npm $(ARGS)

migrate: ## esegue le migrazioni
	$(DC) exec -u $(USER_ID) api php artisan migrate

fresh: ## azzera il DB e rilancia migrazioni (+seed)
	$(DC) exec -u $(USER_ID) api php artisan migrate:fresh --seed

test: ## test backend
	$(DC) exec -u $(USER_ID) api php artisan test

reset: ## cancella container E volumi (dati DB persi!)
	$(DC) down -v
