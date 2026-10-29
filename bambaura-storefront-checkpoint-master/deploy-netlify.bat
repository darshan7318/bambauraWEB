@echo off
echo ========================================================
echo  BAMBAURA 9X - NETLIFY PRODUCTION FRONTEND DEPLOYMENT
echo ========================================================
echo.
echo 1. Building latest optimized production bundle...
call npm run build
echo.
echo 2. Packaging production release archive...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath '..\bambaura-storefront-dist.zip' -Force"
echo.
echo 3. Deploying to Netlify...
call npx --yes netlify deploy --dir=dist --prod
if %errorlevel% neq 0 (
    echo.
    echo ----------------------------------------------------------------------
    echo [NETLIFY DIRECT DEPLOYMENT FALLBACK]
    echo If Netlify CLI encountered an npm cache permission lock or needs login:
    echo  1. Open: https://app.netlify.com/sites/shiny-kataifi-342f63/deploys
    echo     (or https://app.netlify.com/drop)
    echo  2. Drag and drop the folder: 
    echo     c:\Dev\CLIENTS\BAMBAURAWEB\bambaura-storefront\dist
    echo     (or upload c:\Dev\CLIENTS\BAMBAURAWEB\bambaura-storefront-dist.zip)
    echo ----------------------------------------------------------------------
)
echo.
pause
