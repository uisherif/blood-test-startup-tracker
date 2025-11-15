# Automated Data Updates System

## Overview

The blood test startup tracker now includes an **automated data refresh system** that:
- Runs daily at 2 AM to check for new information
- Searches news sources for funding announcements, user metrics, and company updates
- Parses articles to extract structured data
- Creates pending updates for manual review
- Provides API endpoints to approve/reject updates

## Architecture

```
┌─────────────────┐
│  Cron Schedule  │
│   (Daily 2 AM)  │
└────────┬────────┘
         │
         v
┌─────────────────────────────────────────┐
│  Data Refresh Service                   │
│  - searchStartupNews()                  │
│  - parseNewsForUpdates()                │
│  - filterValidUpdates()                 │
└────────┬────────────────────────────────┘
         │
         v
┌─────────────────────────────────────────┐
│  Update Review Service                  │
│  - savePendingUpdate()                  │
│  - Stores in pending-updates.json       │
└────────┬────────────────────────────────┘
         │
         v
┌─────────────────────────────────────────┐
│  Manual Review (via API or Dashboard)   │
│  - Approve: Apply to startups.json      │
│  - Reject: Discard with notes           │
└─────────────────────────────────────────┘
```

## How It Works

### 1. News Search
For each startup, the system searches for recent news using queries like:
- `"[Startup Name] funding"`
- `"[Startup Name] raises"`
- `"[Startup Name] Series A/B/C"`
- `"[Startup Name] valuation"`
- `"[Startup Name] users members"`

### 2. Data Extraction
The parser looks for patterns in news articles:

**Funding Amounts:**
- "raises $50 million"
- "raised $100M in Series B"
- "$2.5 billion valuation"

**User Metrics:**
- "200,000 members"
- "60 million users"
- "1 in 86 households"

**Acquisitions:**
- "acquired by [Company]"
- "[Company] acquires [Startup]"

### 3. Validation & Filtering
Updates are filtered based on:
- **Confidence level**: High/Medium/Low
- **Reasonable changes**: Funding should increase, not decrease
- **Significance**: Changes > 5% to avoid noise
- **Recency**: Most recent and highest confidence wins

### 4. Manual Review
All detected updates require human approval to ensure accuracy.

## API Endpoints

### Trigger Manual Refresh
```bash
POST http://localhost:3001/api/updates/refresh

Response:
{
  "message": "Data refresh completed",
  "startupsChecked": 4,
  "updatesFound": 2,
  "updates": [...]
}
```

### View Pending Updates
```bash
GET http://localhost:3001/api/updates/pending

Response: [
  {
    "id": "function-health-totalFunding-1731456789",
    "startupId": "function-health",
    "field": "totalFunding",
    "oldValue": 306000000,
    "newValue": 500000000,
    "source": "https://techcrunch.com/...",
    "confidence": "high",
    "timestamp": "2025-11-15T00:00:00Z",
    "status": "pending"
  }
]
```

### Get Summary
```bash
GET http://localhost:3001/api/updates/summary

Response:
{
  "pending": 3,
  "approved": 10,
  "rejected": 2,
  "byStartup": {
    "function-health": 2,
    "everlywell": 1
  }
}
```

### Approve Update
```bash
POST http://localhost:3001/api/updates/{id}/approve
Content-Type: application/json

{
  "reviewedBy": "your-name"
}
```

### Reject Update
```bash
POST http://localhost:3001/api/updates/{id}/reject
Content-Type: application/json

{
  "reviewedBy": "your-name",
  "notes": "Duplicate of previous update"
}
```

## Adding Real Data Sources

The system is built to support real APIs. Here's how to integrate them:

### NewsAPI (Recommended)
```bash
# Get free API key at https://newsapi.org
echo "NEWS_API_KEY=your_key_here" >> packages/api/.env
```

Update `newsSearchService.ts`:
```typescript
const response = await fetch(
  `https://newsapi.org/v2/everything?` +
  `q=${encodeURIComponent(query)}&` +
  `from=${fromDate}&` +
  `sortBy=publishedAt&` +
  `apiKey=${process.env.NEWS_API_KEY}`
);
```

### Crunchbase API
```bash
# Get API key at https://www.crunchbase.com/
echo "CRUNCHBASE_API_KEY=your_key_here" >> packages/api/.env
```

Example integration:
```typescript
const response = await fetch(
  `https://api.crunchbase.com/api/v4/entities/organizations/${startupId}`,
  {
    headers: {
      'X-cb-user-key': process.env.CRUNCHBASE_API_KEY
    }
  }
);
```

### Google News API
```bash
# Use Google Custom Search API
echo "GOOGLE_API_KEY=your_key_here" >> packages/api/.env
echo "GOOGLE_CSE_ID=your_cse_id" >> packages/api/.env
```

### PitchBook (Enterprise)
Contact PitchBook for API access - enterprise only.

## Data Quality & Safety

### Confidence Levels
- **High**: Direct quotes from official sources, press releases
- **Medium**: Reputable news outlets, inferred from context
- **Low**: Social media, unverified sources

### Validation Rules
1. Funding can only increase (with 10% tolerance for adjustments)
2. Changes must be > 5% to be significant
3. User counts should grow or stay flat
4. Duplicate updates are deduplicated by recency and confidence

### Manual Review Required
All updates require approval to prevent:
- False positives from incorrect parsing
- Outdated information
- Misattributed data
- Duplicate entries

## Testing the System

### 1. Test Manual Refresh
```bash
curl -X POST http://localhost:3001/api/updates/refresh
```

### 2. Check for Pending Updates
```bash
curl http://localhost:3001/api/updates/pending
```

### 3. View Summary
```bash
curl http://localhost:3001/api/updates/summary
```

### 4. Simulate an Update
Edit `data/pending-updates.json` manually to test approval workflow.

## Customization

### Change Schedule
Edit `packages/api/src/services/dataRefresh.ts`:
```typescript
// Run every 6 hours
cron.schedule('0 */6 * * *', async () => { ... });

// Run every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => { ... });
```

### Add More Data Sources
Extend `newsSearchService.ts` with additional sources:
```typescript
export async function searchLinkedInUpdates(startup: Startup) {
  // Check employee count changes
}

export async function searchTwitterMentions(startup: Startup) {
  // Monitor for announcements
}
```

### Customize Parsing Rules
Modify regex patterns in `parseNewsForUpdates()` to match different formats.

## Future Enhancements

### Planned Features
- [ ] Auto-approve high-confidence updates from trusted sources
- [ ] Email notifications for new pending updates
- [ ] Slack/Discord webhook integration
- [ ] Historical tracking of all changes
- [ ] Confidence score based on source reputation
- [ ] Machine learning for better data extraction
- [ ] LinkedIn integration for employee counts
- [ ] Twitter/X monitoring for announcements
- [ ] RSS feed aggregation

### Integration Ideas
- **Zapier**: Trigger on new updates
- **Airtable**: Store pending updates
- **Notion**: Documentation of changes
- **GitHub Actions**: Weekly summary reports

## Troubleshooting

### No Updates Found
- Check that news API keys are set in `.env`
- Verify API rate limits haven't been exceeded
- Check console logs for error messages
- Test with manual queries on news sites

### False Positives
- Adjust confidence thresholds in `filterValidUpdates()`
- Add more specific regex patterns
- Implement source reputation scoring

### Missing Updates
- Expand search queries
- Add more data sources
- Decrease minimum change threshold

## Cost Considerations

### Free Tier Options
- **NewsAPI**: 100 requests/day free
- **Google News**: Limited free tier
- **Web scraping**: Free but rate-limited

### Paid Options
- **NewsAPI**: $449/month for unlimited
- **Crunchbase**: Enterprise pricing
- **PitchBook**: Enterprise pricing

### Recommended Approach
Start with free tier NewsAPI + manual updates, then upgrade as needed.

## Monitoring

### Logs
All operations are logged to console. In production, use:
- **Winston** or **Pino** for structured logging
- **LogRocket** for error tracking
- **Datadog** for monitoring

### Metrics to Track
- Updates found per day
- Approval/rejection rate
- API call success rate
- Time to review updates
- Data freshness per startup

## Security

### API Key Protection
- Never commit `.env` files
- Use environment variables in production
- Rotate keys regularly
- Implement rate limiting

### Data Validation
- Sanitize all external inputs
- Validate data types and ranges
- Log all data changes
- Implement rollback capability
