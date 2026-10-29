#!/usr/bin/env bash
# ==============================================================================
# Bambaura 9X Salt — Hostinger KVM2 VPS Automated Setup & Deploy Script
# OS: Ubuntu 22.04 / 24.04 LTS or Debian 11/12
# ==============================================================================

set -e

DOMAIN="bambaura.com"       # Replace with your primary domain or VPS IP
WEB_ROOT="/var/www/bambaura"

echo "=================================================="
echo " Starting Bambaura 9X Storefront VPS Provisioning"
echo "=================================================="

# 1. Update OS Packages
echo "[1/5] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Nginx and UFW firewall if not already installed
echo "[2/5] Installing Nginx & Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx ufw rsync curl

# Configure UFW firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# 3. Create Web Directory and set ownership
echo "[3/5] Setting up web root directory at ${WEB_ROOT}..."
sudo mkdir -p ${WEB_ROOT}/dist
sudo chown -R $USER:www-data ${WEB_ROOT}
sudo chmod -R 755 ${WEB_ROOT}

# 4. Copy Nginx Configuration
echo "[4/5] Deploying Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/bambaura.conf
sudo ln -sf /etc/nginx/sites-available/bambaura.conf /etc/nginx/sites-enabled/

# Remove default site if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# 5. SSL Notice & Completion
echo "=================================================="
echo " Nginx Server is now active and configured!"
echo "=================================================="
echo "To copy your local 'dist' build from your PC to this VPS, run from your Windows machine:"
echo "  scp -r dist/* your_user@your_vps_ip:${WEB_ROOT}/dist/"
echo ""
echo "To generate free Let's Encrypt SSL certificate, run on this VPS:"
echo "  sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "=================================================="

