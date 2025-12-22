# Deployment Guide - Corphaus

This guide covers deploying the Corphaus application to production using GitHub Pages (frontend) and Render (backend).

## ✅ What's Already Configured

### Frontend (GitHub Pages)
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Vite build configuration with base path `/Corphaus/`
- ✅ API URL configured to use Render backend: `https://corphaus-backend.onrender.com/api`
- ✅ Build script working correctly
- ✅ Automatic deployment on push to `master` branch

### Backend (Render)
- ✅ Server configured to use `PORT` environment variable (Render provides this)
- ✅ CORS configured to allow all origins (`origin: '*'`)
- ✅ MongoDB Atlas connection ready
- ✅ All routes and controllers implemented

## 🚀 Deployment Steps

### 1. Frontend - GitHub Pages (Automatic)

The frontend is automatically deployed when you push to the `master` branch. The GitHub Actions workflow will:
1. Build the React app
2. Deploy to GitHub Pages

**Your site will be available at:**
```
https://dima336l.github.io/Corphaus/
```

**Note:** Make sure GitHub Pages is enabled in your repository settings:
- Go to Settings → Pages
- Source should be set to "GitHub Actions"

### 2. Backend - Render

#### Step 1: Create Render Account
1. Go to https://render.com and sign up
2. Connect your GitHub account

#### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your repository: `Dima336l/Corphaus`
3. Configure the service:
   - **Name:** `corphaus-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free or Starter (based on your needs)

#### Step 3: Set Environment Variables
In Render dashboard, go to your service → Environment → Add the following:

**Required:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/corphaus?retryWrites=true&w=majority
NODE_ENV=production
```

**Optional (but recommended):**
```env
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=https://dima336l.github.io/Corphaus
REVOLUT_API_KEY=your_revolut_api_key_here
REVOLUT_API_URL=https://merchant.revolut.com/api/1.0
REVOLUT_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Your backend will be available at: `https://corphaus-backend.onrender.com`

**Note:** The first deployment may take a few minutes. Free tier services spin down after 15 minutes of inactivity, so the first request after inactivity may be slow.

### 3. Update Frontend API URL (if needed)

The frontend is already configured to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://corphaus-backend.onrender.com/api';
```

If your Render backend URL is different, you can:
1. Set the environment variable `VITE_API_URL` in GitHub Actions, OR
2. Update the default in `src/utils/api.js`

To set environment variable in GitHub Actions, add to `.github/workflows/deploy.yml`:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: https://your-backend-url.onrender.com/api
```

## 🔍 Verification Checklist

### Frontend
- [ ] GitHub Pages is enabled in repository settings
- [ ] GitHub Actions workflow runs successfully (check Actions tab)
- [ ] Site is accessible at `https://dima336l.github.io/Corphaus/`
- [ ] API calls are working (check browser console)

### Backend
- [ ] Render service is running
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working (check Render logs)
- [ ] Health endpoint responds: `https://corphaus-backend.onrender.com/api/health`
- [ ] CORS allows requests from GitHub Pages URL

### Testing
- [ ] Test user registration/login
- [ ] Test property listing creation
- [ ] Test wanted ad creation
- [ ] Test messaging functionality
- [ ] Test search and filtering

## 🐛 Troubleshooting

### Frontend Issues

**Build fails:**
- Check GitHub Actions logs
- Ensure all dependencies are in `package.json`
- Verify Node version in workflow (currently Node 20)

**API calls fail:**
- Check browser console for CORS errors
- Verify backend URL is correct
- Check if backend is running (may be spun down on free tier)

**404 errors on page refresh:**
- This is expected with React Router on GitHub Pages
- Consider using HashRouter (already configured) or add 404 redirect

### Backend Issues

**Service won't start:**
- Check Render logs for errors
- Verify all environment variables are set
- Check MongoDB connection string format
- Ensure `package.json` has correct start script

**MongoDB connection fails:**
- Verify connection string in environment variables
- Check MongoDB Atlas Network Access (should allow all IPs: `0.0.0.0/0`)
- Verify database user credentials

**CORS errors:**
- Backend is configured to allow all origins (`origin: '*'`)
- If issues persist, add specific frontend URL to CORS config

**Service spins down (free tier):**
- Free tier services on Render spin down after 15 min inactivity
- First request after spin down takes ~30 seconds (cold start)
- Consider upgrading to Starter plan for always-on service

## 📝 Environment Variables Reference

### Backend (.env on Render)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `PORT` | Server port (provided by Render) | Auto |
| `NODE_ENV` | Environment (production/development) | Recommended |
| `JWT_SECRET` | Secret for JWT tokens | Recommended |
| `FRONTEND_URL` | Frontend URL for CORS | Recommended |
| `REVOLUT_API_KEY` | Revolut API key for payments | Optional |
| `REVOLUT_API_URL` | Revolut API endpoint | Optional |
| `REVOLUT_WEBHOOK_SECRET` | Webhook secret for Revolut | Optional |

### Frontend (GitHub Actions)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Optional (has default) |

## 🔄 Update Process

### Frontend Updates
1. Make changes locally
2. Commit and push to `master` branch
3. GitHub Actions automatically builds and deploys
4. Wait 1-2 minutes for deployment

### Backend Updates
1. Make changes locally
2. Commit and push to `master` branch
3. Render automatically detects changes and redeploys
4. Check Render dashboard for deployment status

## 📊 Monitoring

### GitHub Pages
- Check Actions tab for deployment status
- View site at: https://dima336l.github.io/Corphaus/

### Render
- Dashboard shows service status
- View logs in real-time
- Set up alerts for downtime (Pro plan)

## 🔒 Security Notes

1. **Never commit `.env` files** - Use Render environment variables
2. **Use strong JWT_SECRET** - Generate random string
3. **MongoDB Atlas** - Use strong password, limit network access in production
4. **CORS** - Consider restricting to specific domains in production
5. **HTTPS** - Both GitHub Pages and Render provide HTTPS automatically

---

**Current Status:** ✅ Ready for deployment
**Last Updated:** After fixing message notifications and infinite refresh loop

