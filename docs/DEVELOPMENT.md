# Development Guide

## Project Structure

```
blood-test-startup-tracker/
├── packages/
│   ├── shared/              # Shared TypeScript types
│   │   └── src/
│   │       └── types.ts     # Startup, Metrics, Stats types
│   ├── api/                 # Backend Express API
│   │   └── src/
│   │       ├── index.ts     # Server entry point
│   │       ├── routes/      # API endpoints
│   │       └── services/    # Business logic
│   └── web/                 # Frontend React app
│       └── src/
│           ├── App.tsx      # Main app component
│           └── components/  # React components
├── data/
│   ├── startups.json        # Startup data store
│   └── metrics-schema.json  # JSON schema for validation
└── docs/                    # Documentation
```

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express** - Web framework
- **node-cron** - Scheduled jobs for data refresh
- File-based storage (JSON) - Easy to start, can migrate to DB later

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Fast build tool
- **Recharts** - Data visualization (ready for charts)
- Modern CSS with CSS variables

### Shared
- **TypeScript** - Type safety across the stack
- **npm workspaces** - Monorepo management

## Getting Started

### Prerequisites
```bash
node -v  # Should be 18+
npm -v   # Should be 9+
```

### Installation
```bash
# Install all dependencies
npm install

# Build shared package first
cd packages/shared && npm run build && cd ../..
```

### Development
```bash
# Run both API and web in dev mode
npm run dev

# Or run them separately:
npm run dev:api  # API on http://localhost:3001
npm run dev:web  # Web on http://localhost:3000
```

### Production Build
```bash
npm run build
```

## API Endpoints

### Startups
- `GET /api/startups` - List all startups
- `GET /api/startups/:id` - Get single startup
- `PATCH /api/startups/:id` - Update startup metrics

### Stats
- `GET /api/stats` - Dashboard statistics

### Health
- `GET /health` - API health check

## Adding a New Startup

1. Edit `data/startups.json`
2. Follow the schema in `data/metrics-schema.json`
3. Required fields: id, name, website, description, founded
4. The dashboard will automatically pick it up

Example:
```json
{
  "id": "new-startup",
  "name": "New Startup",
  "website": "https://example.com",
  "description": "Brief description",
  "founded": 2023,
  "metrics": {
    "totalFunding": 10000000,
    "lastFundingRound": {
      "amount": 10000000,
      "type": "Seed",
      "date": "2023-06"
    },
    "estimatedUsers": null,
    "employeeCount": 25,
    "valuation": null
  },
  "lastUpdated": "2024-01-15"
}
```

## Data Refresh System

The API includes a background job (`src/services/dataRefresh.ts`) that runs daily at 2 AM. Currently it's a placeholder for:

### Future Implementations
1. **Crunchbase API Integration**
   - Fetch funding rounds
   - Get employee counts
   - Track company updates

2. **Web Scraping**
   - Company websites for announcements
   - LinkedIn for employee growth
   - Job boards for hiring activity

3. **News Monitoring**
   - RSS feeds from tech news sites
   - Google News API
   - Twitter/X mentions

4. **Manual Updates**
   - Admin interface for data entry
   - Update queue and approval workflow
   - Change history tracking

## Frontend Components

### Dashboard
Shows aggregate statistics:
- Total startups tracked
- Combined funding
- Total user base
- Average valuation

### StartupCard
Individual company display:
- Company info and description
- Key metrics (funding, users, employees, valuation)
- Features and differentiators
- Last updated timestamp

### Auto-refresh
- Dashboard fetches data every 5 minutes
- Ensures users see latest information
- Configurable refresh interval

## Styling

Uses CSS variables for easy theming in `index.css`:
```css
--primary: #dc2626        /* Red theme */
--bg: #ffffff             /* White background */
--text: #111827           /* Dark text */
```

Fully responsive design with grid layouts.

## Future Enhancements

### Short Term
- [ ] Add filtering and sorting to dashboard
- [ ] Implement search functionality
- [ ] Create detailed startup pages
- [ ] Add historical data tracking
- [ ] Charts for funding/growth trends

### Medium Term
- [ ] Database integration (PostgreSQL or MongoDB)
- [ ] Real-time data updates (WebSockets)
- [ ] User authentication for admin features
- [ ] API rate limiting and caching
- [ ] Automated data fetching from external APIs

### Long Term
- [ ] Machine learning for trend prediction
- [ ] Competitive analysis tools
- [ ] Email alerts for significant changes
- [ ] Public API for data access
- [ ] Mobile app

## Contributing

When adding features:
1. Update types in `packages/shared/src/types.ts` first
2. Implement backend logic in `packages/api`
3. Update frontend components in `packages/web`
4. Test both API and UI thoroughly
5. Update documentation

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3001 (API)
lsof -ti:3001 | xargs kill

# Kill process on port 3000 (Web)
lsof -ti:3000 | xargs kill
```

### Type errors
```bash
# Rebuild shared package
cd packages/shared && npm run build
```

### CORS issues
Check that the Vite proxy is configured correctly in `packages/web/vite.config.ts`
