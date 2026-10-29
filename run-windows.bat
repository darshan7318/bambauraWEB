@echo off
REM ==============================================================================
REM Bambaura 9X Salt — Fullstack Windows Launcher (React + .NET 10 Minimal APIs)
REM ==============================================================================

echo ====================================================================
echo  Starting Bambaura 9X Salt Fullstack (.NET 10 Minimal APIs + React)
echo ====================================================================

where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Docker detected on this machine.
    echo Press 'D' to launch with Docker Compose (PostgreSQL + App), or press any other key for Native mode.
    choice /C DN /N /T 4 /D N /M "Select mode: [D]ocker Compose / [N]ative (.NET run): "
    if errorlevel 1 if not errorlevel 2 (
        echo Launching Docker Compose...
        docker compose up --build -d
        echo.
        echo [OK] Containers started. Access http://localhost:5000
        pause
        exit /b 0
    )
)

REM 1. Build React Frontend
echo [1/3] Building React Frontend with Vite & DaisyUI...
cd bambaura-storefront
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] React build failed!
    cd ..
    exit /b %ERRORLEVEL%
)

REM 2. Copy dist bundle to .NET wwwroot
echo [2/3] Bundling static assets into .NET 10 wwwroot...
cd ..
if not exist "Bambaura.Api\wwwroot" mkdir "Bambaura.Api\wwwroot"
xcopy /E /Y /Q "bambaura-storefront\dist\*" "Bambaura.Api\wwwroot\"

REM 3. Run .NET 10 Minimal API Host
echo [3/3] Launching .NET 10 Minimal API Server on http://localhost:5000...
cd Bambaura.Api
dotnet run
pause
