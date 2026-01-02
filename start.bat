@echo off
echo Starting frontend (using Render backend: https://corphaus-backend.onrender.com)...
echo Killing any process on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

