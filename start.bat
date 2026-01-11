@echo off
echo ========================================
echo Starting Corphaus Development Servers
echo ========================================
echo.
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:5173
echo.
echo Killing any existing processes on ports 5000 and 5173...
echo.

REM Kill processes on port 5000 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1

REM Kill processes on port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do taskkill /F /PID %%a >nul 2>&1

timeout /t 1 /nobreak >nul

echo Starting backend server...
start "Backend - Port 5000" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting frontend server...
start "Frontend - Port 5173" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers starting in separate windows...
echo ========================================
echo.
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

