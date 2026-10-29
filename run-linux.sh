#!/usr/bin/env bash
# ==============================================================================
# Bambaura 9X Salt — Production Launcher for Hostinger KVM2 VPS (Linux)
# Supports:
#   1. Docker Compose (Recommended for Hostinger KVM2: .NET 10 + PostgreSQL)
#   2. Native Mode (.NET 10 + Node.js)
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

MODE="${1:-docker}"

echo "===================================================================="
echo " Bambaura 9X Salt — Fullstack Linux Launcher"
echo " Host OS: $(uname -s) | Target: Hostinger KVM2 VPS"
echo " Mode: $MODE"
echo "===================================================================="

if [ "$MODE" = "docker" ]; then
    echo "[*] Checking Docker & Docker Compose..."
    if ! command -v docker &> /dev/null; then
        echo "[!] Docker not detected. Installing Docker on Hostinger KVM2 VPS (Ubuntu/Debian)..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        sudo systemctl enable docker
        sudo systemctl start docker
        echo "✅ Docker installed successfully."
    fi

    echo "[*] Launching PostgreSQL 16 + Bambaura .NET 10 Fullstack with Docker Compose..."
    docker compose down --remove-orphans || true
    docker compose up --build -d

    echo ""
    echo "===================================================================="
    echo " 🚀 Bambaura Fullstack & PostgreSQL are running in Docker!"
    echo " - Storefront & APIs: http://YOUR_VPS_IP:5000"
    echo " - Health Status:     http://YOUR_VPS_IP:5000/api/health"
    echo " - PostgreSQL DB:     localhost:5432 (bambauradb)"
    echo "===================================================================="
    echo ""
    echo "View logs with: docker compose logs -f"
    exit 0
fi

if [ "$MODE" = "native" ]; then
    PORT=${PORT:-5000}
    echo "[*] Running in Native mode..."
    
    # 1. Check for .NET 10 SDK
    if ! command -v dotnet &> /dev/null; then
        echo "[!] .NET SDK not detected. Installing .NET 10..."
        curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 10.0
        export PATH="$HOME/.dotnet:$PATH"
    fi

    # 2. Build React Frontend if wwwroot is missing
    if [ ! -d "$PROJECT_ROOT/Bambaura.Api/wwwroot" ] || [ -z "$(ls -A "$PROJECT_ROOT/Bambaura.Api/wwwroot")" ]; then
        echo "[1/3] Building React Frontend with Node & Vite..."
        cd "$PROJECT_ROOT/bambaura-storefront"
        npm ci || npm install
        npm run build
        mkdir -p "$PROJECT_ROOT/Bambaura.Api/wwwroot"
        cp -r dist/* "$PROJECT_ROOT/Bambaura.Api/wwwroot/"
        cd "$PROJECT_ROOT"
    fi

    # 3. Publish and Run .NET 10 Minimal API
    echo "[2/3] Building & Publishing .NET 10 Minimal API..."
    cd "$PROJECT_ROOT/Bambaura.Api"
    dotnet publish -c Release -o "$PROJECT_ROOT/publish"

    echo "[3/3] Launching Bambaura Fullstack on http://0.0.0.0:${PORT}..."
    export ASPNETCORE_URLS="http://0.0.0.0:${PORT}"
    cd "$PROJECT_ROOT/publish"
    dotnet Bambaura.Api.dll
fi
