@echo off
echo ========================================
echo Stopping Corphaus Development Servers
echo ========================================
echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo All servers stopped.
echo.
timeout /t 2 /nobreak >nul

