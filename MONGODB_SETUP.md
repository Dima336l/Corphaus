# MongoDB Setup for Local Development

## Quick Setup Guide

Your backend server is running, but it needs a MongoDB connection string to work properly.

### Option 1: Use Production MongoDB URI (Quickest)

If you already have MongoDB Atlas set up for production (on Render):

1. **Get MongoDB URI from Render:**
   - Go to https://dashboard.render.com
   - Click on your backend service (`corphaus-backend`)
   - Go to "Environment" tab
   - Find `MONGODB_URI` and copy the value

2. **Update `backend/.env`:**
   - Open `backend/.env` file
   - Replace the `MONGODB_URI` line with your production connection string
   - Save the file

3. **Restart backend server:**
   - Stop the server (Ctrl+C in the backend window)
   - Run `start.bat` again, or manually start with `cd backend && npm run dev`

### Option 2: Create New MongoDB Atlas Cluster (Recommended for Development)

For local development, it's better to use a separate database:

1. **Sign up for MongoDB Atlas (Free):**
   - Go to https://cloud.mongodb.com/
   - Sign up for a free account (if you don't have one)

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Select "FREE" (M0) tier
   - Choose a cloud provider (AWS recommended)
   - Choose a region closest to you
   - Click "Create"
   - Wait 3-5 minutes for cluster to deploy

3. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Authentication Method: "Password"
   - Username: `corphaus_dev` (or your choice)
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" (left sidebar)
   - Click "Connect" button on your cluster
   - Select "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://...`)
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `corphaus` (or leave it)

6. **Update `backend/.env`:**
   - Open `backend/.env` file
   - Find the line: `MONGODB_URI=mongodb+srv://...`
   - Replace it with your connection string
   - Example:
     ```
     MONGODB_URI=mongodb+srv://corphaus_dev:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/corphaus?retryWrites=true&w=majority
     ```
   - Save the file

7. **Restart Backend:**
   - Stop the server (Ctrl+C in backend window)
   - Run `start.bat` again

### Option 3: Continue Without Database (Testing Only)

The backend will run without MongoDB, but:
- ❌ Login/authentication won't work
- ❌ Database operations won't work
- ✅ API endpoints will still respond
- ✅ Frontend can still run (but with errors)

---

## Verify Connection

After updating `.env` and restarting:

You should see:
```
✅ MongoDB Atlas Connected Successfully!
📊 Database: corphaus
```

Instead of:
```
❌ MongoDB Connection Error: ...
⚠️  Server running without database connection
```

---

## Next Steps After Connection

Once MongoDB is connected, you can seed the database with test data:

```bash
cd backend
npm run setup-test-data
```

This creates:
- 4 test user accounts (see `TEST_ACCOUNTS.md`)
- Sample properties and wanted ads

---

## Troubleshooting

### "Authentication failed"
- Check your database username and password
- Make sure password is URL-encoded (replace special chars like `@` with `%40`)

### "Connection timeout"
- Check Network Access settings in MongoDB Atlas
- Make sure your IP is whitelisted (or use "Allow from anywhere")

### "ENOTFOUND" error
- Check the cluster URL is correct
- Make sure cluster is not paused (free tier clusters can pause after inactivity)
- Resume the cluster in MongoDB Atlas dashboard if needed

### Cluster is paused (Free Tier)
- Go to MongoDB Atlas dashboard
- Click "Resume" on your cluster
- Wait 2-3 minutes for it to resume

---

## Security Notes

- **Never commit `.env` files to git** (they're already in `.gitignore`)
- **Use separate databases** for development and production
- **Use strong passwords** for database users
- **Limit network access** in production (only allow specific IPs)

