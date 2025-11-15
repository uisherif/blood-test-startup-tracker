# Step-by-Step Guide: Setting Up Real Automated Updates

Follow these steps to get your automated data updates working with real news data.

---

## ✅ Step 1: Sign Up for NewsAPI (5 minutes)

### 1.1 Go to NewsAPI
Visit: https://newsapi.org/register

### 1.2 Create Free Account
- Enter your **first name**
- Enter your **email address**
- Create a **password**
- Select **"Individual"** (for personal projects)
- Accept terms of service
- Click **"Submit"**

### 1.3 Get Your API Key
- After registration, you'll see your API key on the dashboard
- It looks like: `1234567890abcdef1234567890abcdef`
- **Copy this key** - you'll need it in the next step

### 1.4 Free Tier Limits
- **100 requests per day** (plenty for 4 startups)
- **Development only** (commercial use requires paid plan)
- **Attribution required** when displaying results

---

## ✅ Step 2: Add Your API Key to the Project (2 minutes)

### 2.1 Open Terminal
Make sure you're in the project directory:
```bash
cd /Users/sherif.maktabi/Documents/Projects/blood-test-startup-tracker
```

### 2.2 Add API Key to Environment File
Run this command (replace `YOUR_KEY_HERE` with your actual key):
```bash
echo "NEWS_API_KEY=YOUR_KEY_HERE" >> packages/api/.env
```

For example:
```bash
echo "NEWS_API_KEY=1234567890abcdef1234567890abcdef" >> packages/api/.env
```

### 2.3 Verify It Was Added
Check the file:
```bash
cat packages/api/.env
```

You should see:
```
PORT=3001

# Future: API keys for data sources
# CRUNCHBASE_API_KEY=
# PITCHBOOK_API_KEY=
# NEWS_API_KEY=
NEWS_API_KEY=1234567890abcdef1234567890abcdef
```

✅ **Checkpoint**: Your API key is now stored securely in the .env file

---

## ✅ Step 3: Enable News API Integration (5 minutes)

Now we need to uncomment the code that makes real API calls.

### 3.1 Open the News Search Service
```bash
# Open in your editor
code packages/api/src/services/newsSearchService.ts

# Or use vim/nano
vim packages/api/src/services/newsSearchService.ts
```

### 3.2 Find the searchStartupNews Function
Look for this section around line 30-65:

```typescript
export async function searchStartupNews(startup: Startup, daysBack: number = 1): Promise<NewsResult[]> {
  const searchQueries = [
    `"${startup.name}" funding`,
    `"${startup.name}" raises`,
    // ...
  ];

  const results: NewsResult[] = [];

  // NOTE: In production, you would:
  // 1. Use a real news API (NewsAPI, Google News API, etc.)
  // 2. Make actual HTTP requests
  // 3. Parse and filter results

  // For now, return empty array - this will be populated when API keys are added
  console.log(`Searching news for ${startup.name} with queries:`, searchQueries);

  // Example of what a real implementation might look like:
  /*
  for (const query of searchQueries) {
    // COMMENTED CODE HERE
  }
  */

  return results;
}
```

### 3.3 Replace the Entire Function
**Delete everything from line ~25 to ~65** and replace with this working code:

```typescript
export async function searchStartupNews(startup: Startup, daysBack: number = 1): Promise<NewsResult[]> {
  const searchQueries = [
    `"${startup.name}" funding`,
    `"${startup.name}" raises`,
    `"${startup.name}" Series`,
    `"${startup.name}" valuation`,
    `"${startup.name}" acquisition`,
    `"${startup.name}" users members`,
  ];

  const results: NewsResult[] = [];

  // Calculate date range
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);
  const fromDateStr = fromDate.toISOString().split('T')[0];

  console.log(`Searching news for ${startup.name} from ${fromDateStr}...`);

  // Make API calls for each query
  for (const query of searchQueries) {
    try {
      const url = `https://newsapi.org/v2/everything?` +
        `q=${encodeURIComponent(query)}&` +
        `from=${fromDateStr}&` +
        `sortBy=publishedAt&` +
        `language=en&` +
        `apiKey=${process.env.NEWS_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`NewsAPI error for query "${query}": ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        console.log(`  Found ${data.articles.length} articles for "${query}"`);

        results.push(...data.articles.map((article: any) => ({
          title: article.title,
          url: article.url,
          publishedDate: article.publishedAt,
          source: article.source.name,
          snippet: article.description || ''
        })));
      }
    } catch (error) {
      console.error(`Error searching news for query "${query}":`, error);
    }

    // Small delay between API calls to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`Total articles found for ${startup.name}: ${results.length}`);
  return results;
}
```

### 3.4 Save the File
- **VS Code**: Press `Cmd+S` (Mac) or `Ctrl+S` (Windows)
- **Vim**: Press `Esc`, then type `:wq` and press Enter
- **Nano**: Press `Ctrl+O`, then `Ctrl+X`

✅ **Checkpoint**: The code is now ready to make real API calls

---

## ✅ Step 4: Restart the Server (1 minute)

The server should auto-restart when you save the file, but let's verify:

### 4.1 Check Server Status
Look at your terminal where `npm run dev` is running. You should see:
```
[0] 7:45:23 PM [tsx] change in ./src/services/newsSearchService.ts Restarting...
[0] API server running on http://localhost:3001
```

### 4.2 If It Didn't Restart
Stop the server (`Ctrl+C`) and start it again:
```bash
npm run dev
```

### 4.3 Verify Server Is Running
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","timestamp":"2025-11-15T..."}
```

✅ **Checkpoint**: Server is running with new code

---

## ✅ Step 5: Test the Automation! (2 minutes)

### 5.1 Trigger a Manual Data Refresh
```bash
curl -X POST http://localhost:3001/api/updates/refresh
```

### 5.2 Watch the Console Output
In your terminal running the server, you should see:
```
Starting data refresh job...
Checking 4 startups for updates...
Searching news for Function Health...
Searching news for Function Health from 2025-11-14...
  Found 3 articles for ""Function Health" funding"
  Found 1 articles for ""Function Health" raises"
Total articles found for Function Health: 15
Extracted 2 potential updates from news
1 valid updates after filtering
Saved pending update for Function Health: totalFunding
...
```

### 5.3 Expected Response
You should get back:
```json
{
  "message": "Data refresh completed",
  "startupsChecked": 4,
  "updatesFound": 1,
  "updates": [
    {
      "startupId": "function-health",
      "field": "totalFunding",
      "oldValue": 306000000,
      "newValue": 500000000,
      "source": "https://techcrunch.com/...",
      "confidence": "high",
      "timestamp": "2025-11-15T00:00:00Z"
    }
  ]
}
```

✅ **Checkpoint**: Real news data is being fetched and parsed!

---

## ✅ Step 6: Review Pending Updates (2 minutes)

### 6.1 View All Pending Updates
```bash
curl http://localhost:3001/api/updates/pending | jq '.'
```

### 6.2 You'll See Updates Like This
```json
[
  {
    "id": "function-health-totalFunding-1731654321000",
    "startupId": "function-health",
    "field": "totalFunding",
    "oldValue": 306000000,
    "newValue": 500000000,
    "source": "https://techcrunch.com/2025/11/14/function-health-raises-200m",
    "confidence": "high",
    "timestamp": "2025-11-14T12:00:00Z",
    "status": "pending"
  }
]
```

### 6.3 Check the Source
Copy the URL from the `source` field and open it in your browser to verify the information is correct.

✅ **Checkpoint**: You can see what updates were found

---

## ✅ Step 7: Approve or Reject Updates (3 minutes)

### 7.1 If an Update is Correct - Approve It
```bash
# Copy the "id" from the pending update
curl -X POST http://localhost:3001/api/updates/function-health-totalFunding-1731654321000/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif"}'
```

Response:
```json
{"message":"Update approved successfully"}
```

### 7.2 If an Update is Wrong - Reject It
```bash
curl -X POST http://localhost:3001/api/updates/function-health-totalFunding-1731654321000/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reviewedBy":"sherif",
    "notes":"This is old news from 2024, already included in current total"
  }'
```

### 7.3 View Summary of Actions
```bash
curl http://localhost:3001/api/updates/summary
```

Returns:
```json
{
  "pending": 2,
  "approved": 1,
  "rejected": 1,
  "byStartup": {
    "function-health": 1,
    "everlywell": 1
  }
}
```

✅ **Checkpoint**: You can manage updates through the API

---

## ✅ Step 8: Verify Data Was Updated (2 minutes)

### 8.1 Check the Startup Data
```bash
curl http://localhost:3001/api/startups/function-health | jq '.metrics'
```

### 8.2 Check Updated Data File
```bash
cat data/startups.json | jq '.[] | select(.id=="function-health") | .metrics'
```

### 8.3 View in Dashboard
Open http://localhost:3000 in your browser and check if the data reflects the approved updates.

✅ **Checkpoint**: Approved updates are applied to the data

---

## ✅ Step 9: Set Up Daily Automation (Already Done!)

The cron job is already configured to run daily at 2 AM. It will:
1. Search for news about all startups
2. Extract metrics from articles
3. Create pending updates
4. Wait for your review

### 9.1 Check Schedule
The server logs show:
```
Data refresh job scheduled (daily at 2 AM)
You can also trigger manual refresh via POST /api/updates/refresh
```

### 9.2 Change Schedule (Optional)
Edit `packages/api/src/services/dataRefresh.ts`:

```typescript
// Run every 6 hours
cron.schedule('0 */6 * * *', async () => { ... });

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => { ... });

// Run every Monday at 8 AM
cron.schedule('0 8 * * 1', async () => { ... });
```

✅ **Checkpoint**: System will run automatically every day

---

## 🎉 Success! What Happens Now

### Daily Process (Automatic)
1. **2 AM**: System searches news for all startups
2. **2:05 AM**: Pending updates are created
3. **9 AM**: You check pending updates
4. **9:10 AM**: You approve/reject updates
5. **Done**: Data stays fresh with minimal effort

### Your Daily Routine
```bash
# Morning: Check for updates
curl http://localhost:3001/api/updates/pending | jq '.'

# Review each one in browser (click source link)

# Approve good ones
curl -X POST http://localhost:3001/api/updates/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif"}'

# Reject bad ones
curl -X POST http://localhost:3001/api/updates/{id}/reject \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif","notes":"reason"}'
```

---

## 📊 What to Expect

### Realistic Expectations
- **Updates per day**: 0-5 (depends on news volume)
- **Accuracy**: ~70-80% (that's why manual review is needed)
- **Time saved**: 80%+ compared to manual research
- **False positives**: 20-30% (old news, misinterpreted data)

### Common Findings
- ✅ Major funding rounds detected immediately
- ✅ Valuation changes from official announcements
- ✅ User milestone announcements
- ⚠️ Sometimes picks up old news (check dates)
- ⚠️ May misinterpret cumulative vs new funding
- ⚠️ Rarely, parsing errors on unusual formats

---

## 🐛 Troubleshooting

### "API key not found" Error
```bash
# Check .env file exists
cat packages/api/.env

# Make sure API key is there
grep NEWS_API_KEY packages/api/.env
```

### "Too Many Requests" Error
You've hit the 100 requests/day limit. Either:
- Wait until tomorrow
- Reduce search frequency
- Upgrade to paid plan ($449/month)

### No Updates Found
- Normal! Not every day has news
- Try manually: `curl -X POST http://localhost:3001/api/updates/refresh`
- Check if startups had any announcements

### Server Not Restarting
```bash
# Stop server
Ctrl+C

# Restart
npm run dev
```

---

## 📈 Next Steps

### Now That It's Working
1. **Check daily** for pending updates
2. **Build intuition** for what's accurate
3. **Refine patterns** if needed
4. **Add more startups** to track
5. **Consider paid tier** if you need more requests

### Enhancements
- Add email notifications (Sendgrid)
- Create web UI for review
- Add more data sources (Crunchbase)
- Implement auto-approve for high-confidence

---

## 🎯 Quick Reference Commands

```bash
# Trigger manual refresh
curl -X POST http://localhost:3001/api/updates/refresh

# View pending
curl http://localhost:3001/api/updates/pending | jq '.'

# View summary
curl http://localhost:3001/api/updates/summary

# Approve
curl -X POST http://localhost:3001/api/updates/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif"}'

# Reject
curl -X POST http://localhost:3001/api/updates/{id}/reject \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"sherif","notes":"reason"}'
```

**You're all set! The system is now running with real data.** 🚀
