# Deployment Guide

This guide will help you deploy the Consumer Health Testing Market Tracker to production with automated updates running 24/7.

## Prerequisites

1. **GitHub Account** - For code hosting and CI/CD
2. **Railway Account** - For backend API hosting (free tier available)
3. **Vercel Account** - For frontend hosting (free tier available)
4. **NewsAPI Key** - Sign up at https://newsapi.org (100 requests/day free)

## Architecture

```
┌─────────────┐
│   Vercel    │  Frontend (React/Vite)
│  (Frontend) │  https://your-app.vercel.app
└──────┬──────┘
       │
       │ API calls
       │
┌──────▼──────┐
│   Railway   │  Backend (Node.js + Express)
│  (Backend)  │  Cron job runs at 2 AM daily
└─────────────┘
```

## Step 1: Push to GitHub

```bash
# Make sure you're in the project root
cd /path/to/blood-test-startup-tracker

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for production"

# Create GitHub repo and push
gh repo create blood-test-startup-tracker --public --source=. --push
# Or manually create repo on github.com and:
git remote add origin https://github.com/YOUR_USERNAME/blood-test-startup-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `blood-test-startup-tracker` repository
4. Railway will auto-detect the Node.js project

### Configure Environment Variables

In Railway project settings, add these variables:

```
PORT=3001
NODE_ENV=production
NEWS_API_KEY=your_actual_newsapi_key
FRONTEND_URL=https://your-app.vercel.app
```

### Configure Deployment

- **Build Command**: `npm install && cd packages/api && npm install`
- **Start Command**: `npm run start --workspace=packages/api`
- **Health Check Path**: `/api/startups`

### Get Your API URL

After deployment, Railway will give you a URL like:
`https://blood-test-startup-tracker-production-XXXX.up.railway.app`

**Copy this URL - you'll need it for Vercel!**

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Select your `blood-test-startup-tracker` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Update API Proxy

Before deploying, update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RAILWAY-URL.up.railway.app/api/:path*"
    }
  ]
}
```

Replace `YOUR-RAILWAY-URL` with your actual Railway URL.

### Deploy

Click **"Deploy"** and Vercel will build and deploy your frontend.

Your app will be live at: `https://your-project.vercel.app`

## Step 4: Verify Automation is Running

### Check Cron Job

The data refresh cron job is configured in `packages/api/src/services/dataRefresh.ts` and runs daily at 2 AM.

To verify it's working:

1. **Check Railway Logs**:
   - Go to your Railway project
   - Click on "Deployments" → "View Logs"
   - Look for: `Data refresh job scheduled (daily at 2 AM)`

2. **Trigger Manual Refresh**:
   ```bash
   curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/updates/refresh
   ```

3. **Check Pending Updates**:
   ```bash
   curl https://YOUR-RAILWAY-URL.up.railway.app/api/updates/pending
   ```

## Step 5: Set Up Monitoring (Optional but Recommended)

### UptimeRobot (Free)

1. Go to https://uptimerobot.com
2. Add a new monitor:
   - **Type**: HTTP(S)
   - **URL**: Your Railway API URL + `/api/startups`
   - **Interval**: 5 minutes
3. Configure alerts to your email

### Backup Cron Service

To ensure data updates even if Railway restarts:

1. Go to https://cron-job.org
2. Create account and add new cron job:
   - **Title**: Health Test Tracker Data Refresh
   - **URL**: `https://YOUR-RAILWAY-URL.up.railway.app/api/updates/refresh`
   - **Schedule**: Daily at 2:00 AM
   - **Method**: POST

## Step 6: Add Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., `healthtest-tracker.com`)
4. Follow DNS configuration instructions

### For Railway (Backend)

1. Go to Railway project settings
2. Click "Generate Domain" or add custom domain
3. Update CORS settings in API code if needed

## Environment Variables Summary

### Railway (Backend)
```
PORT=3001
NODE_ENV=production
NEWS_API_KEY=your_newsapi_key
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-railway-url.up.railway.app
```

## Troubleshooting

### Automation Not Running

1. Check Railway logs for cron job initialization
2. Verify environment variables are set
3. Check that NEWS_API_KEY is valid
4. Try manual refresh endpoint to test

### CORS Errors

1. Make sure `FRONTEND_URL` is set in Railway
2. Verify the URL matches exactly (no trailing slash)
3. Check API logs for blocked requests

### Build Failures

**Backend:**
- Ensure all dependencies are in `package.json`
- Check Node version compatibility
- Review Railway build logs

**Frontend:**
- Verify `vercel.json` paths are correct
- Check that API URL is properly configured
- Review Vercel build logs

## Updating Your App

### Code Changes

```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push

# Railway and Vercel will auto-deploy!
```

### Data Updates

The automation runs daily, but you can also:

1. **Manual Update via API**:
   ```bash
   curl -X POST https://your-api-url.railway.app/api/updates/refresh
   ```

2. **Direct JSON Edit**:
   - Update `data/startups.json` locally
   - Commit and push changes
   - Redeploy

## Cost Estimate

- **Railway**: Free tier (500 hours/month) or $5/month for hobby plan
- **Vercel**: Free tier (includes custom domains)
- **NewsAPI**: Free (100 requests/day, more than enough)
- **UptimeRobot**: Free (50 monitors)
- **cron-job.org**: Free

**Total**: $0-5/month depending on usage

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Verify automation is running
5. ✅ Set up monitoring
6. ⭐ Add more startups to track
7. ⭐ Get real API keys for better data
8. ⭐ Add custom domain
9. ⭐ Share with the world!

## Support

If you encounter issues:
1. Check Railway logs
2. Check Vercel logs
3. Review this guide
4. Test endpoints manually with curl

---

**Your app is now live and updating automatically!** 🎉
