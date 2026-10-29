#!/usr/bin/env bash
# ==============================================================================
# Bambaura 9X Salt — Hostinger KVM2 Production Go-Live Deployment Script
# Optimized for: Hostinger KVM 2 (2 vCPU, 8GB RAM, NVMe, Ubuntu/Debian)
# ==============================================================================

set -e

echo "=========================================================="
echo " 🏰 BAMBAURA 9X — HOSTINGER KVM2 PRODUCTION GO-LIVE"
echo "=========================================================="

# 1. Update package manager
echo "1. Updating host packages..."
apt-get update -y

# 2. Configure Hostinger UFW Firewall (Strict Security Hardening)
echo "2. Configuring UFW firewall rules..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp comment 'SSH' || true
    ufw allow 80/tcp comment 'HTTP Nginx' || true
    ufw allow 443/tcp comment 'HTTPS Nginx' || true
    # Ensure internal DB and API ports are NOT accessible externally
    ufw deny 5432/tcp comment 'Block External Postgres' || true
    ufw deny 5000/tcp comment 'Block External Kestrel API' || true
    ufw --force enable || true
    echo "✅ UFW Firewall hardened (Ports 22, 80, 443 allowed; 5432, 5000 blocked externally)."
fi

# 3. Ensure Docker Engine is installed
echo "3. Checking Docker Engine..."
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker Engine & Compose..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm -f get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker Engine installed."
fi

# 4. Determine Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "📦 Installing docker-compose-plugin..."
    apt-get install -y docker-compose-plugin
    DOCKER_COMPOSE="docker compose"
fi

# 5. Environment configuration
if [ ! -f .env ]; then
    echo "4. Initializing .env from .env.production..."
    cp .env.production .env
fi

# 6. Build and launch production multi-container stack
echo "5. Building and launching production containers with $DOCKER_COMPOSE..."
$DOCKER_COMPOSE down --remove-orphans || true
$DOCKER_COMPOSE build --pull
$DOCKER_COMPOSE up -d

# 7. Verification & Health Monitoring
echo "6. Verifying container health..."
sleep 10
$DOCKER_COMPOSE ps

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "=========================================================="
echo " 🚀 BAMBAURA 9X IS LIVE ON HOSTINGER KVM2!"
echo "=========================================================="
echo " Storefront & API: http://${SERVER_IP}"
echo " Health Status:    http://${SERVER_IP}/api/health"
echo " Container Status: $DOCKER_COMPOSE ps"
echo ""
echo " 🔒 To activate free Let's Encrypt SSL for your domain:"
echo "    ./init-ssl.sh yourdomain.com admin@yourdomain.com"
echo "=========================================================="
