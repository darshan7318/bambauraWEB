# Bambaura 9X Salt - Hostinger Fast Packaging Script
$root = "C:\Dev\CLIENTS\BAMBAURAWEB"
$staging = "$root\staging_hostinger"
$zipOutput = "$root\hostinger-bambaura-deploy.zip"

Write-Host "Preparing clean staging directory..."
if (Test-Path $staging) { Remove-Item -Recurse -Force $staging }
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "Copying deployment configuration files..."
Copy-Item "$root\docker-compose.yml" "$staging\"
Copy-Item "$root\Dockerfile" "$staging\"
Copy-Item "$root\.dockerignore" "$staging\"
Copy-Item "$root\deploy-hostinger.sh" "$staging\"
Copy-Item "$root\init-ssl.sh" "$staging\"
Copy-Item "$root\.env.production" "$staging\"
Copy-Item "$root\.env" "$staging\"

Write-Host "Copying Nginx configuration..."
robocopy "$root\nginx" "$staging\nginx" /E /NFL /NDL /NJH /NJS | Out-Null

Write-Host "Copying Bambaura.Api (excluding bin and obj)..."
robocopy "$root\Bambaura.Api" "$staging\Bambaura.Api" /E /XD bin obj .vs /NFL /NDL /NJH /NJS | Out-Null

Write-Host "Copying bambaura-storefront (excluding node_modules)..."
robocopy "$root\bambaura-storefront" "$staging\bambaura-storefront" /E /XD node_modules .git .vs /NFL /NDL /NJH /NJS | Out-Null

Write-Host "Compressing into hostinger-bambaura-deploy.zip..."
if (Test-Path $zipOutput) { Remove-Item -Force $zipOutput }
Compress-Archive -Path "$staging\*" -DestinationPath $zipOutput -Force

Write-Host "Cleaning up staging folder..."
Remove-Item -Recurse -Force $staging

$zipSize = (Get-Item $zipOutput).Length / 1MB
Write-Host "=========================================================="
Write-Host "SUCCESS: hostinger-bambaura-deploy.zip generated!"
Write-Host "Package Size: $([Math]::Round($zipSize, 2)) MB"
Write-Host "Location: $zipOutput"
Write-Host "=========================================================="
