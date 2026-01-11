# Database Seeding Guide

## Why Does the Database Get Wiped?

If you're using **MongoDB Atlas Free Tier (M0)** or **Render Free Tier**, your database may periodically lose data due to:

1. **MongoDB Atlas Free Tier Limitations:**
   - Clusters pause after 65 days of inactivity
   - Limited storage (512MB)
   - Clusters may be reset if paused for too long
   - Network access issues

2. **Render Free Tier:**
   - Services spin down after 15 minutes of inactivity
   - Cold starts can cause connection issues
   - Environment variables might not persist correctly

3. **Solutions:**
   - ✅ **Upgrade MongoDB Atlas to M2+** (paid tier) - Data persists, no automatic pausing
   - ✅ **Upgrade Render to Starter plan** - Always-on service, no spin-downs
   - ✅ **Use local development** - Run backend locally with your own MongoDB Atlas connection

---

## Quick Re-Seed (Production Database)

If you need to re-seed the production database on Render:

### Option 1: Using Production MongoDB URI Locally

1. **Get MongoDB URI from Render:**
   - Go to Render dashboard → Your backend service → Environment
   - Copy the `MONGODB_URI` value

2. **Create temporary .env file:**
   ```bash
   cd backend
   # Create .env file with production MongoDB URI
   echo "MONGODB_URI=your_production_mongodb_uri_here" > .env
   ```

3. **Run seeding script:**
   ```bash
   npm run setup-test-data
   ```

4. **Delete .env file after seeding** (for security):
   ```bash
   # Windows PowerShell
   Remove-Item .env
   ```

### Option 2: Use Local Development (Recommended)

Set up local development environment to avoid production database issues:

1. **Create local .env file:**
   ```bash
   cd backend
   copy env.example .env
   ```

2. **Edit `.env` file:**
   - Add your MongoDB Atlas connection string
   - Can use same MongoDB cluster or create separate test database

3. **Start local backend:**
   ```bash
   npm run dev
   ```

4. **Seed local database:**
   ```bash
   npm run setup-test-data
   ```

5. **Update frontend to use local backend:**
   - Create `.env` file in root directory:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Or modify `src/utils/api.js` temporarily

---

## Seeding Commands

### Full Setup (Users + Data):
```bash
cd backend
npm run setup-test-data
```

This runs:
1. `createTestUsers.js` - Creates 4 test user accounts
2. `seedWithUserData.js` - Seeds properties and wanted ads

### Individual Commands:
```bash
cd backend

# Step 1: Create test users only
npm run create-test-users

# Step 2: Seed properties/wanted ads (requires users to exist)
npm run seed-data
```

---

## Test Accounts Created

After seeding, you can log in with:

| Email | Password | Role | Plan |
|-------|----------|------|------|
| `landlord@test.com` | `password123` | Landlord | Free |
| `business@test.com` | `password123` | Business | Free |
| `landlord.pro@test.com` | `password123` | Landlord | Pro |
| `business.pro@test.com` | `password123` | Business | Pro |

See `TEST_ACCOUNTS.md` for detailed information about each account.

---

## Preventing Data Loss

### For Development:
- Use local backend with local MongoDB Atlas cluster
- Keep backups of your database
- Use separate development/staging/production databases

### For Production:
- ⚠️ **Upgrade MongoDB Atlas to M2+** (Minimum $9/month)
  - No automatic pausing
  - Guaranteed data persistence
  - Better performance
  - More storage

- ⚠️ **Upgrade Render to Starter Plan** (Minimum $7/month)
  - Always-on service (no spin-downs)
  - Faster response times
  - Better reliability

### Free Tier Workarounds:
- Re-seed database regularly
- Document your data structure
- Keep seeding scripts up to date
- Consider using MongoDB Atlas backups (if available)

---

## Troubleshooting

### "Test users not found" Error:
- Run `npm run create-test-users` first
- Then run `npm run seed-data`

### "MongoDB Connection Error":
- Verify MongoDB URI is correct
- Check MongoDB Atlas Network Access (should allow your IP)
- Ensure database user credentials are correct
- Check if MongoDB Atlas cluster is paused (free tier)

### "Cannot connect to database":
- Free tier MongoDB clusters pause after inactivity
- Go to MongoDB Atlas → Click "Resume" on your cluster
- Wait 2-3 minutes for cluster to resume

---

## Next Steps

1. **For Production:** Upgrade to paid tiers to prevent data loss
2. **For Development:** Set up local environment with `.env` file
3. **Keep backups:** Export database regularly if using free tier
4. **Monitor:** Check MongoDB Atlas dashboard for cluster status

