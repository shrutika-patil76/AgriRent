# MongoDB Atlas Setup Guide

## Overview
MongoDB Atlas is a cloud-hosted MongoDB service. It's free for development and scales easily for production.

## Complete Setup Steps

### Step 1: Create MongoDB Atlas Account
1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email and password
4. Verify your email address
5. Log in to your account

### Step 2: Create a Free Cluster
1. Click "Create" button
2. Select **M0 Cluster** (Free tier - 512MB storage)
3. Choose cloud provider:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. Select region closest to you (e.g., ap-south-1 for India)
5. Click "Create Cluster"
6. Wait 2-3 minutes for cluster to be created

### Step 3: Create Database User
1. In left sidebar, click **Database Access**
2. Click "Add New Database User"
3. Select "Password" authentication method
4. Enter credentials:
   - **Username:** `agrirent_user`
   - **Password:** Create a strong password (min 8 chars, mix of letters/numbers/symbols)
   - **Example:** `AgriRent@2024Secure`
5. Click "Add User"

### Step 4: Configure Network Access
1. In left sidebar, click **Network Access**
2. Click "Add IP Address"
3. Choose one option:
   - **Option A (Recommended for Development):** Click "Add Current IP Address"
   - **Option B (Less Secure):** Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to **Clusters** section
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Choose:
   - **Driver:** Node.js
   - **Version:** 4.x or later
5. Copy the connection string (example):
   ```
   mongodb+srv://agrirent_user:PASSWORD@cluster0.xxxxx.mongodb.net/agri_rental?retryWrites=true&w=majority
   ```

### Step 6: Update Backend Configuration

Replace `YOUR_PASSWORD` and cluster details in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://agrirent_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/agri_rental?retryWrites=true&w=majority
```

**Example with real values:**
```env
MONGODB_URI=mongodb+srv://agrirent_user:AgriRent@2024Secure@cluster0.abcde.mongodb.net/agri_rental?retryWrites=true&w=majority
```

### Step 7: Seed Database

After updating `.env`, seed your online database:

```bash
cd backend
node seed.js
```

You should see:
```
✅ Connected to MongoDB
✅ Existing data cleared
✅ Created 6 users
✅ Created 12 equipment items
✅ Created 5 bookings
✅ Created 8 reviews
🎉 Database seeded successfully!
```

### Step 8: Start Your Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## Verify Connection

1. Go to MongoDB Atlas dashboard
2. Click on your cluster
3. Go to **Collections** tab
4. You should see:
   - Database: `agri_rental`
   - Collections: `users`, `tools`, `bookings`, `reviews`

## Important Notes

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

- **USERNAME:** Database user (agrirent_user)
- **PASSWORD:** User password (URL encode special characters)
- **CLUSTER:** Your cluster name (e.g., cluster0.abcde)
- **DATABASE:** Database name (agri_rental)

### Special Characters in Password
If your password contains special characters like `@`, `#`, `$`, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `:` → `%3A`

**Example:** Password `Pass@123` becomes `Pass%40123`

### Troubleshooting

**Error: "Authentication failed"**
- Check username and password are correct
- Verify IP address is whitelisted
- Check database name is correct

**Error: "Connection timeout"**
- Verify IP address is whitelisted
- Check internet connection
- Try "Allow Access from Anywhere" temporarily

**Error: "Database not found"**
- Ensure database name is `agri_rental`
- Run seed.js to create collections

## Free Tier Limits

- **Storage:** 512 MB
- **Connections:** 100 concurrent
- **Backup:** Automatic daily backups
- **Uptime:** 99.5% SLA

Perfect for development and testing!

## Upgrade to Paid (When Needed)

When you need more storage or performance:
1. Go to **Billing** in Atlas dashboard
2. Click "Upgrade Cluster"
3. Choose M2 or higher tier
4. No downtime during upgrade

## Security Best Practices

1. ✅ Use strong passwords (min 12 characters)
2. ✅ Whitelist only necessary IP addresses
3. ✅ Enable IP Whitelist (not "Allow from Anywhere" in production)
4. ✅ Use environment variables for credentials
5. ✅ Never commit `.env` file to Git
6. ✅ Rotate passwords periodically
7. ✅ Enable database-level authentication

## Next Steps

After successful setup:
1. Test login with existing credentials
2. Create new user account
3. Add equipment listings
4. Test booking functionality
5. Verify emails are sent

Your app is now using cloud database! 🎉
