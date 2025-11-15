# 🚀 Quick Deployment Guide (5 Minutes)

## TL;DR

1. Push to GitHub
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Done! Automation runs automatically.

---

## Step 1: Push to GitHub (1 min)

```bash
git add .
git commit -m "Ready for production"

# Using GitHub CLI (recommended):
gh repo create blood-test-startup-tracker --public --source=. --push

# Or manually:
# 1. Create repo on github.com
# 2. git remote add origin https://github.com/YOUR_USERNAME/blood-test-startup-tracker.git
# 3. git push -u origin main
```

## Step 2: Deploy Backend to Railway (2 min)

1. Go to https://railway.app → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → Select your repo
3. **Add Variables**:
   ```
   PORT=3001
   NODE_ENV=production
   NEWS_API_KEY=get_from_newsapi.org
   ```
4. **Settings** → **Generate Domain** → Copy the URL
   - Will look like: `https://xxx.up.railway.app`

## Step 3: Deploy Frontend to Vercel (2 min)

1. Go to https://vercel.com → Sign in with GitHub
2. **Add New** → **Project** → Select your repo
3. **Configure**:
   - Framework: Vite
   - Root Directory: `packages/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Before deploying**, update `vercel.json` with your Railway URL:
   ```json
   {
     "rewrites": [{
       "source": "/api/:path*",
       "destination": "https://YOUR-RAILWAY-URL.up.railway.app/api/:path*"
     }]
   }
   ```
5. Commit and push this change, then deploy!

## Step 4: Verify It Works

Visit your Vercel URL → You should see the app!

**Test automation**:
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/startups
```

---

## ✅ You're Done!

- ✅ App is live at `https://your-project.vercel.app`
- ✅ Automation runs daily at 2 AM automatically
- ✅ Data updates are saved to pending-updates.json
- ✅ Check Railway logs to see cron job status

## Optional: Get Better Data

Sign up for free API key at https://newsapi.org (100 requests/day free)

Then add to Railway environment variables:
```
NEWS_API_KEY=your_actual_key_here
```

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
