# Corphaus Backend API

Node.js/Express backend with MongoDB Atlas integration for the Corphaus B2B Property Platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB Atlas

1. **Create Account:** Go to https://cloud.mongodb.com/ and sign up
2. **Create Cluster:**
   - Click "Create" → "Shared" (Free tier)
   - Choose cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `corphaus_admin` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://...`)

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://corphaus_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/corphaus?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace:
- `YOUR_PASSWORD` with your database user password
- `cluster0.xxxxx` with your actual cluster URL
- `corphaus` is the database name (will be created automatically)

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ MongoDB Atlas Connected Successfully!
📊 Database: corphaus
🚀 Server running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

## 📡 API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```
Returns server and database status.

### Test Endpoint
```
GET http://localhost:5000/api
```
Returns API information and available endpoints.

### Future Endpoints (Ready)
```
GET /api/properties      - Get all properties
POST /api/properties     - Create property (auth required)
GET /api/properties/:id  - Get single property
PUT /api/properties/:id  - Update property (auth required)
DELETE /api/properties/:id - Delete property (auth required)

GET /api/wanted-ads      - Get all wanted ads
POST /api/wanted-ads     - Create wanted ad (auth required)
GET /api/wanted-ads/:id  - Get single wanted ad
PUT /api/wanted-ads/:id  - Update wanted ad (auth required)
DELETE /api/wanted-ads/:id - Delete wanted ad (auth required)

POST /api/auth/signup    - Register new user
POST /api/auth/login     - Login user
GET /api/auth/me         - Get current user (auth required)
```

## 📁 Project Structure

```
backend/
├── models/              # Mongoose schemas
│   ├── Property.js     # Property model
│   ├── WantedAd.js     # Wanted Ad model
│   └── User.js         # User model
├── server.js           # Main server file
├── package.json        # Dependencies
├── env.example         # Environment variables template
└── README.md          # This file
```

## 🗄️ Database Models

### Property
- User reference, landlord info
- Property details (type, bedrooms, features)
- Location, regulations, business models
- Financial terms, photos

### WantedAd
- User reference, business info
- Property requirements
- Location preferences
- Budget and lease terms

### User
- Authentication (email, password)
- Role (landlord/business)
- Subscription (free/pro)
- Profile information

## 🔄 Current Status

✅ Backend server setup
✅ MongoDB Atlas connection
✅ Database models defined
✅ Basic API routes created
⏳ **Frontend still using mock data** (as requested)

## 🚧 Next Steps (When Ready)

1. **Implement Authentication:**
   - Add bcrypt for password hashing
   - Add JWT for session management
   - Create auth middleware

2. **Create API Routes:**
   - Properties CRUD operations
   - Wanted Ads CRUD operations
   - User management

3. **Connect Frontend:**
   - Replace localStorage with API calls
   - Add axios/fetch for HTTP requests
   - Update AuthContext to use backend

4. **Add Features:**
   - File upload (Cloudinary/AWS S3)
   - Email notifications
   - Search/filtering
   - Matching algorithm
   - Messaging system

## 🧪 Testing the Connection

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or open in browser:
http://localhost:5000/api/health
```

## 📝 Notes

- **Frontend:** Continue using mock data from `src/data/mockData.js`
- **Backend:** Running separately, just connected to MongoDB
- **Database:** Models ready for when you want to switch from mock data
- **Deployment:** Backend will need separate hosting (Heroku, Render, Railway, etc.)

## 🐛 Troubleshooting

### "MongoDB Connection Error"
- Check your connection string in `.env`
- Verify database user password
- Ensure IP is whitelisted in MongoDB Atlas Network Access
- Check if cluster is still starting up (wait 3-5 min)

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Backend is ready but NOT required for frontend to work!**

The frontend will continue using localStorage and mock data until you're ready to integrate. 🚀

