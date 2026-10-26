# syntax=docker/dockerfile:1

############################
# Base comune (dev + prod) #
############################
FROM php:8.3-fpm-alpine AS base

RUN apk add --no-cache git unzip libzip-dev postgresql-dev \
 && docker-php-ext-install -j"$(nproc)" pdo_pgsql zip bcmath pcntl opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

############################
# Sviluppo                 #
############################
FROM base AS dev
COPY docker/php/conf/dev.ini /usr/local/etc/php/conf.d/zz-dev.ini
# Il pool gira con lo stesso UID/GID dell'utente host (vedi docker-compose.yml)
COPY docker/php/conf/fpm-dev.conf /usr/local/etc/php-fpm.d/zz-dev-user.conf
EXPOSE 9000
CMD ["php-fpm"]

############################
# Produzione               #
############################
FROM base AS prod
COPY docker/php/conf/prod.ini /usr/local/etc/php/conf.d/zz-prod.ini

# Dipendenze prima del codice: sfrutta la cache dei layer
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY backend/ ./
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative \
 && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

USER www-data
EXPOSE 9000
CMD ["php-fpm"]
