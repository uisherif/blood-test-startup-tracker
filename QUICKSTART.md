# Quick Start Guide

Get up and running in 5 minutes!

## 1. Setup

Run the automated setup script:

```bash
./setup.sh
```

Or manually:

```bash
npm install
cd packages/shared && npm install && npm run build && cd ../..
cd packages/api && npm install && cd ../..
cd packages/web && npm install && cd ../..
```

## 2. Start Development Servers

```bash
npm run dev
```

This starts:
- **API**: http://localhost:3001
- **Dashboard**: http://localhost:3000

## 3. View the Dashboard

Open your browser to http://localhost:3000

You should see:
- Summary statistics at the top
- Cards for each blood test startup below
- Metrics like funding, users, employees, and valuation

## 4. Test the API

```bash
# Get all startups
curl http://localhost:3001/api/startups

# Get specific startup
curl http://localhost:3001/api/startups/function-health

# Get dashboard stats
curl http://localhost:3001/api/stats

# Health check
curl http://localhost:3001/health
```

## 5. Add a New Startup

Edit [data/startups.json](data/startups.json) and add a new entry:

```json
{
  "id": "my-startup",
  "name": "My Startup",
  "website": "https://example.com",
  "description": "Blood testing startup",
  "founded": 2024,
  "headquarters": "San Francisco, CA",
  "metrics": {
    "totalFunding": 5000000,
    "lastFundingRound": {
      "amount": 5000000,
      "type": "Seed",
      "date": "2024-01"
    },
    "estimatedUsers": 1000,
    "employeeCount": 10,
    "valuation": null
  },
  "founders": ["Founder Name"],
  "keyFeatures": ["Feature 1", "Feature 2"],
  "lastUpdated": "2024-01-15"
}
```

Refresh the dashboard to see your new startup!

## 6. Update Metrics

Use the API to update startup data:

```bash
curl -X PATCH http://localhost:3001/api/startups/function-health \
  -H "Content-Type: application/json" \
  -d '{
    "metrics": {
      "estimatedUsers": 150000
    }
  }'
```

## Project Structure

```
├── data/startups.json       # Your startup data
├── packages/
│   ├── api/                 # Backend API
│   ├── web/                 # Frontend dashboard
│   └── shared/              # Shared types
└── docs/                    # Documentation
```

## Next Steps

- Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed dev guide
- Check [docs/STARTUPS.md](docs/STARTUPS.md) for research notes
- Add more startups to track
- Customize the dashboard styling
- Implement automated data collection

## Troubleshooting

**Port already in use?**
```bash
# Kill processes
lsof -ti:3001 | xargs kill  # API
lsof -ti:3000 | xargs kill  # Web
```

**Build errors?**
```bash
# Rebuild shared package
cd packages/shared && npm run build
```

## Need Help?

Check the documentation:
- [README.md](README.md) - Project overview
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide
- [docs/STARTUPS.md](docs/STARTUPS.md) - Startup research

## What's Included

### Current Features
✅ Real-time dashboard with auto-refresh
✅ REST API for startup data
✅ 4 startups pre-configured (Function Health, InsideTracker, Everlywell, Thorne)
✅ Metrics tracking (funding, users, employees, valuation)
✅ Responsive design
✅ TypeScript throughout

### Coming Soon
🔜 Data refresh automation
🔜 Historical trend tracking
🔜 Charts and visualizations
🔜 Search and filtering
🔜 Admin interface for updates
