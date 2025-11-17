# Security Configuration

## Overview

The Blood Test Startup Tracker now includes API key authentication and CORS restrictions to protect sensitive admin operations.

## Security Features

### 1. API Key Authentication

All admin endpoints require an API key to prevent unauthorized access:

**Protected Endpoints:**
- `GET /api/updates/pending` - View pending updates
- `GET /api/updates/summary` - Get updates summary
- `POST /api/updates/refresh` - Trigger manual data refresh
- `POST /api/updates/:id/approve` - Approve an update
- `POST /api/updates/:id/reject` - Reject an update

**Public Endpoints (no auth required):**
- `GET /api/startups` - List all startups
- `GET /api/stats` - Dashboard statistics
- `GET /api/history` - Historical data
- `GET /health` - Health check

### 2. CORS Restrictions

The API only accepts requests from whitelisted frontend domains, preventing cross-origin attacks.

---

## Setup Instructions

### Step 1: Generate API Key

Generate a secure random API key:

```bash
# On macOS/Linux
openssl rand -hex 32

# Example output:
# a3f5c8e2d9b1a6f4e7c3d8b2a1f5e9c4d7b3a6f2e8c1d5b9a4f7e3c8d2b6a1f5
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `packages/api/` directory:

```bash
cd packages/api
cp ../../.env.example .env
```

Edit `.env` and add your API key:

```env
# Security - Admin API Key
ADMIN_API_KEY=a3f5c8e2d9b1a6f4e7c3d8b2a1f5e9c4d7b3a6f2e8c1d5b9a4f7e3c8d2b6a1f5

# CORS Configuration
FRONTEND_URL=http://localhost:3000,http://localhost:5173

# For production, use your deployed frontend URL
# FRONTEND_URL=https://your-app.vercel.app,https://staging.your-app.vercel.app
```

### Step 3: Restart the API Server

```bash
npm run dev:api
```

You should see:
```
🔒 Admin endpoints protected with API key
```

---

## Using the API with Authentication

### With curl

Include the API key in the `x-api-key` header:

```bash
# View pending updates
curl -H "x-api-key: YOUR_API_KEY" \
  http://localhost:3001/api/updates/pending

# Trigger manual refresh
curl -X POST \
  -H "x-api-key: YOUR_API_KEY" \
  http://localhost:3001/api/updates/refresh

# Approve an update
curl -X POST \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy": "your-name"}' \
  http://localhost:3001/api/updates/UPDATE_ID/approve

# Reject an update
curl -X POST \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy": "your-name", "notes": "Reason for rejection"}' \
  http://localhost:3001/api/updates/UPDATE_ID/reject
```

### With JavaScript/fetch

```javascript
const API_KEY = 'your_api_key_here';
const API_URL = 'http://localhost:3001';

// Fetch pending updates
const response = await fetch(`${API_URL}/api/updates/pending`, {
  headers: {
    'x-api-key': API_KEY
  }
});

const updates = await response.json();

// Approve an update
await fetch(`${API_URL}/api/updates/${updateId}/approve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    reviewedBy: 'sherif'
  })
});
```

### With Postman

1. Create a new request
2. Set method to `GET` or `POST`
3. Enter URL: `http://localhost:3001/api/updates/pending`
4. Go to **Headers** tab
5. Add header:
   - Key: `x-api-key`
   - Value: `your_api_key_here`
6. Click **Send**

---

## CORS Configuration

### Development

By default, these origins are allowed:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)

### Production

Set the `FRONTEND_URL` environment variable to your deployed frontend URL(s):

```env
# Single domain
FRONTEND_URL=https://your-app.vercel.app

# Multiple domains (comma-separated)
FRONTEND_URL=https://your-app.vercel.app,https://staging.your-app.vercel.app
```

### Testing CORS

```bash
# This should work (from allowed origin)
curl -H "Origin: http://localhost:3000" \
  http://localhost:3001/api/startups

# This should be blocked (from disallowed origin)
curl -H "Origin: https://evil-site.com" \
  http://localhost:3001/api/startups
```

---

## Security Best Practices

### 1. Keep API Keys Secret

- ✅ Store in `.env` files (never commit to git)
- ✅ Use environment variables in production
- ✅ Rotate keys regularly (every 90 days)
- ❌ Never hardcode in source code
- ❌ Never share in Slack/email
- ❌ Never commit to version control

### 2. Use HTTPS in Production

Ensure your production API uses HTTPS to encrypt API keys in transit:

```env
# Production API URL should use HTTPS
API_URL=https://api.your-domain.com
```

Railway and most hosting providers automatically provide HTTPS.

### 3. Rotate Keys After Exposure

If an API key is accidentally exposed:

1. Generate a new key: `openssl rand -hex 32`
2. Update `.env` on server
3. Restart API server
4. Update key in any scripts/tools

### 4. Monitor Access Logs

Check your server logs for:
- Unauthorized access attempts
- Blocked CORS requests
- Unusual traffic patterns

```bash
# Look for warnings in logs
tail -f packages/api/logs/access.log | grep "⚠️"
```

### 5. Use Rate Limiting (Future Enhancement)

Consider adding rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});

app.use('/api/updates', limiter, requireApiKey, updatesRouter);
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Generate a strong API key (32+ characters)
- [ ] Set `ADMIN_API_KEY` in production environment
- [ ] Set `FRONTEND_URL` to your actual frontend domain(s)
- [ ] Set `NODE_ENV=production`
- [ ] Verify HTTPS is enabled
- [ ] Test API key authentication works
- [ ] Test CORS restrictions work
- [ ] Remove any test/debug API keys
- [ ] Document key rotation schedule

---

## Troubleshooting

### "Unauthorized" Error

**Problem:** Getting 401 Unauthorized when calling admin endpoints

**Solutions:**
1. Verify API key is set in `.env`:
   ```bash
   cat packages/api/.env | grep ADMIN_API_KEY
   ```
2. Check you're including the `x-api-key` header
3. Verify no extra spaces in the key
4. Restart the API server after changing `.env`

### CORS Error in Browser

**Problem:** Browser shows CORS error when frontend calls API

**Solutions:**
1. Add your frontend URL to `FRONTEND_URL` in `.env`:
   ```env
   FRONTEND_URL=http://localhost:3000,http://localhost:5173
   ```
2. Restart API server
3. Check browser console for the exact blocked origin
4. Ensure `x-api-key` is in `allowedHeaders` (already configured)

### API Key Not Required (Development)

**Problem:** Admin endpoints work without API key in development

**Explanation:** By design, if `ADMIN_API_KEY` is not set in `.env` and `NODE_ENV=development`, the API allows unauthenticated access for easier local development.

**To enforce authentication in development:**
```env
NODE_ENV=production
ADMIN_API_KEY=your_key_here
```

---

## API Key Management for Teams

### Option 1: Shared Key (Simple)

- Use one API key for the whole team
- Share via password manager (1Password, LastPass)
- Rotate when team members leave

### Option 2: Individual Keys (Advanced)

Extend the middleware to support multiple keys:

```typescript
// packages/api/src/middleware/auth.ts
const VALID_API_KEYS = process.env.ADMIN_API_KEYS?.split(',') || [];

export function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
```

Then in `.env`:
```env
ADMIN_API_KEYS=key1_for_sherif,key2_for_alice,key3_for_bob
```

### Option 3: Database-Backed Keys (Production)

For production with multiple users, consider:
- Store API keys in database with user associations
- Track which key made each request
- Implement key expiration
- Add per-key rate limits

---

## Support

Questions about security configuration?

1. Check this documentation first
2. Review the [AUTOMATED-UPDATES.md](./AUTOMATED-UPDATES.md) guide
3. Open an issue on GitHub
4. Contact the development team

**Remember:** Never share API keys in support requests!
