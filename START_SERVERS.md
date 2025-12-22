# Starting Development Servers

## Quick Start

### Option 1: Two Separate Windows (Recommended)
Double-click `start-dev.bat` to open two separate command windows:
- One for backend (port 5000)
- One for frontend (port 5173)

**Advantages:**
- See logs from both servers clearly
- Easy to debug issues
- Can stop each server independently

### Option 2: Background Mode
Double-click `start-dev-single.bat` to run both servers in the background.

**Advantages:**
- Doesn't open extra windows
- Logs are written to files (backend.log, frontend.log)
- Can check server status

### Option 3: Single Window (Concurrent)
Double-click `start-dev-concurrent.bat` to run both servers in one window.

**Requirements:**
- Requires `concurrently` package (will install automatically)

**Advantages:**
- All logs in one place
- Color-coded output
- Easy to see both servers at once

## Stopping Servers

Double-click `stop-dev.bat` to stop all Node.js processes (both servers).

## Manual Start

If you prefer to start servers manually:

### Backend
```bash
cd backend
npm run dev
```

### Frontend (in a new terminal)
```bash
npm run dev
```

## Server URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Troubleshooting

### Servers won't start
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Make sure dependencies are installed: `npm install` (in both root and backend directories)

### Port already in use
1. Check if ports 5000 or 5173 are already in use
2. Stop any existing Node.js processes: `stop-dev.bat`
3. Or change the ports in the configuration files

### Backend not connecting to MongoDB
1. Check that `backend/.env` file exists
2. Verify MongoDB connection string is correct
3. Check that MongoDB is running (if using local MongoDB)
4. Server will start even without MongoDB, but API won't work

### Frontend not connecting to backend
1. Check that `.env` file exists in root directory
2. Verify `VITE_API_URL=http://localhost:5000/api` is set
3. Make sure backend is running on port 5000
4. Restart frontend after changing `.env` file

## Environment Files

Make sure these files exist:

### `backend/.env`
```
MONGODB_URI=mongodb://localhost:27017/corphaus
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_jwt_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

### `.env` (root directory)
```
VITE_API_URL=http://localhost:5000/api
```

## Notes

- Backend uses nodemon for auto-reload (if installed)
- Frontend uses Vite for fast hot-reload
- Both servers watch for file changes and auto-reload
- Logs show in real-time in the command windows
- Use Ctrl+C to stop a server manually in its window

