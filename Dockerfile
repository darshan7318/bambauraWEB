# ==============================================================================
# Bambaura 9X Salt — Hostinger Fullstack Production Dockerfile
# Multi-stage: Node 20 (React SPA) + .NET 10 SDK + ASP.NET 10 Runtime
# ==============================================================================

# Stage 1: Build React Storefront Bundle
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY bambaura-storefront/package*.json ./
RUN npm ci
COPY bambaura-storefront/ ./
RUN npm run build

# Stage 2: Build .NET 10 API & Embed Frontend into wwwroot
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /app/backend
COPY Bambaura.Api/*.csproj ./
RUN dotnet restore
COPY Bambaura.Api/ ./
# Copy compiled React frontend from Stage 1 into wwwroot
COPY --from=frontend-builder /app/frontend/dist ./wwwroot
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: High-Performance Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_RUNNING_IN_CONTAINER=true
COPY --from=backend-builder /app/publish ./

ENTRYPOINT ["dotnet", "Bambaura.Api.dll"]
