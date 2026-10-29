#!/usr/bin/env bash
# ==============================================================================
# Bambaura 9X Salt — Hostinger KVM2 Automated SSL Provisioning
# Generates Let's Encrypt SSL certificates and enables HTTPS in Nginx
# ==============================================================================

set -e

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./init-ssl.sh <your-domain.com> [admin-email]"
    echo "Example: ./init-ssl.sh bambaura.com contact@bambaura.com"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    EMAIL="admin@${DOMAIN}"
fi

echo "=========================================================="
echo " 🔒 Bambaura 9X — Let's Encrypt SSL Setup for ${DOMAIN}"
echo "=========================================================="

# 1. Determine Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# 2. Ensure containers are up in HTTP mode
echo "1. Checking Nginx HTTP reverse proxy..."
$DOCKER_COMPOSE up -d bambaura-proxy

# 3. Request certificate from Let's Encrypt
echo "2. Requesting Let's Encrypt certificate for ${DOMAIN} & www.${DOMAIN}..."
$DOCKER_COMPOSE run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}" \
    --email "${EMAIL}" \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal \
    --non-interactive

# 4. Activate HTTPS Nginx Configuration
echo "3. Activating HTTPS configuration with HTTP->HTTPS redirection..."
sed "s/\${DOMAIN_NAME}/${DOMAIN}/g" nginx/nginx-ssl.conf.template > nginx/nginx.conf

# 5. Reload Nginx
echo "4. Reloading Nginx with active SSL..."
$DOCKER_COMPOSE exec bambaura-proxy nginx -s reload

echo ""
echo "=========================================================="
echo " 🎉 SSL ACTIVATED SUCCESSFULLY!"
echo " Live Secure Site: https://${DOMAIN}"
echo " Certificates will auto-renew in background via certbot."
echo "=========================================================="

