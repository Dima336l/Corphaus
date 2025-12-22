# Local Testing Guide

## ✅ Current Status

- **Frontend**: Running on http://localhost:5173 ✅
- **Backend**: Starting on http://localhost:5000 ⏳
- **Environment Files**: Created ✅

## 🚀 Quick Start

### 1. Environment Files Created

- `backend/.env` - Backend configuration
- `.env` - Frontend configuration (points to localhost:5000)

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

Or if nodemon is not installed:
```bash
cd backend
node server.js
```

### 3. Start Frontend Server

```bash
npm run dev
```

## 📊 Server URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🗄️ MongoDB Setup

### Option 1: Use MongoDB Atlas (Free Cloud - Recommended)

1. Go to https://cloud.mongodb.com/
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/corphaus?retryWrites=true&w=majority
   ```

### Option 2: Use Local MongoDB

1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/corphaus`
4. Update `backend/.env` if needed

### Option 3: Test Without MongoDB

The backend server will start even without MongoDB, but:
- API endpoints will not work properly
- You'll see "MongoDB Connection Error" in the console
- The server will still respond to health checks

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Properties
```bash
curl http://localhost:5000/api/properties
```

### Get Property by ID
```bash
curl http://localhost:5000/api/properties/PROPERTY_ID
```

## 📝 Seed Database (Optional)

If you have MongoDB connected, you can seed the database with test data:

```bash
cd backend
node seedDatabase.js
```

Or with user data:
```bash
cd backend
node seedWithUserData.js
```

## 🔧 Troubleshooting

### Backend Not Starting

1. Check if port 5000 is already in use:
   ```bash
   netstat -ano | findstr :5000
   ```

2. Check backend logs for errors
3. Verify `.env` file exists in `backend/` directory
4. Check MongoDB connection string is correct

### Frontend Not Connecting to Backend

1. Verify `VITE_API_URL` in `.env` is set to `http://localhost:5000/api`
2. Check backend is running on port 5000
3. Check CORS settings in backend
4. Restart frontend server after changing `.env`

### MongoDB Connection Issues

1. Verify MongoDB is running (if local)
2. Check connection string in `backend/.env`
3. If using Atlas, check:
   - IP is whitelisted
   - Database user credentials are correct
   - Network access is enabled

## 🎯 Next Steps

1. **Start Backend**: Make sure backend is running on port 5000
2. **Start Frontend**: Frontend should be running on port 5173
3. **Test API**: Visit http://localhost:5173 and test property listing
4. **Check Console**: Check browser console for any API errors
5. **Seed Data**: If MongoDB is connected, seed the database with test data

## 📌 Important Notes

- Backend server must be running before frontend can fetch properties
- If MongoDB is not connected, you'll see errors but the server will still run
- Environment variables are in `.env` files (not committed to git)
- Frontend automatically reloads when code changes
- Backend uses nodemon for auto-reload (if installed)

## 🐛 Common Issues

### "Failed to fetch" Error
- Backend is not running
- Backend is running on different port
- CORS issue (check backend CORS settings)

### "MongoDB Connection Error"
- MongoDB is not running
- Connection string is incorrect
- Network access not configured (for Atlas)

### Empty Property List
- Database is empty (seed the database)
- Backend is not connected to MongoDB
- API endpoint is not working

## ✅ Success Indicators

- ✅ Frontend loads at http://localhost:5173
- ✅ Backend responds at http://localhost:5000/api/health
- ✅ Properties page shows data (or "No properties" message)
- ✅ No console errors in browser
- ✅ Backend logs show "MongoDB Connected" (if MongoDB is set up)

