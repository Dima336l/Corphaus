@echo off
echo Killing processes on ports 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

