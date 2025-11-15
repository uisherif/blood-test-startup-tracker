# Consumer Health Testing Market Tracker

A real-time dashboard for tracking key metrics of leading consumer health testing and diagnostics startups with **automated daily updates**.

![Minimalist Red Cross Design](https://img.shields.io/badge/Design-Minimalist-red) ![Auto Updates](https://img.shields.io/badge/Updates-Automated-success) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

## 🎯 Features

- **📊 Live Dashboard** - Track funding, users, valuations, and growth trends
- **🤖 Automated Updates** - Daily data refresh at 2 AM with news source parsing
- **📈 Interactive Charts** - Visualize growth trends across multiple metrics
- **🏥 Clean Design** - Minimalist Red Cross aesthetic with bold typography
- **⚡ Real-time** - Data updates reflected immediately
- **🔍 Smart Parsing** - Extracts metrics from news articles automatically

## 🚀 Tracked Companies

- **Function Health** - $306M raised, 200K+ members, $2.5B valuation
- **Everlywell** - $325M raised, 60M+ users, #1 at-home testing
- **GRAIL** - $2B raised, $8B valuation, multi-cancer detection
- **InsideTracker** - $19M raised, AI-powered health analytics
- **Thorne HealthTech** - Integrated testing & supplements
- **Superpower** - Daily at-home monitoring platform

## 📊 Tracked Metrics

- Total funding raised
- Latest funding round details
- User/member count
- Company valuation
- Employee headcount
- Revenue (when available)
- Historical growth trends

## 🏗️ Project Structure

```
blood-test-startup-tracker/
├── packages/
│   ├── api/          # Express API with automated updates
│   ├── web/          # React/Vite dashboard
│   └── shared/       # Shared TypeScript types
├── data/
│   ├── startups.json           # Main startup data
│   ├── historical-data.json    # Time-series data
│   └── pending-updates.json    # Updates awaiting review
├── docs/             # Documentation
├── .claude/          # Claude Code skills
├── DEPLOYMENT.md     # Full deployment guide
└── QUICK-DEPLOY.md   # 5-minute deployment
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Recharts (data visualization)
- DM Sans & Space Mono (typography)

**Backend:**
- Node.js + Express
- TypeScript
- node-cron (scheduled jobs)
- JSON file storage (easily upgradeable to DB)

**Design:**
- Minimalist German Red Cross aesthetic
- Clean white backgrounds
- Bold red accents (#E30613)
- Functional Swiss/German minimalism

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
# Install dependencies
npm install

# Start both API and web server
npm run dev

# API: http://localhost:3001
# Web: http://localhost:3000
```

### Run Automation

```bash
# Trigger manual data refresh
curl -X POST http://localhost:3001/api/updates/refresh

# View pending updates
curl http://localhost:3001/api/updates/pending

# Approve an update
curl -X POST http://localhost:3001/api/updates/{id}/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewedBy":"your-name"}'
```

## 🌐 Deploy to Production

**Option 1: Quick Deploy (5 minutes)**

See [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) for fastest deployment.

**Option 2: Full Guide**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide with monitoring.

**Recommended Stack:**
- **Backend**: Railway.app ($0-5/month)
- **Frontend**: Vercel (free)
- **Monitoring**: UptimeRobot (free)
- **Backup Cron**: cron-job.org (free)

## 🤖 Automated Updates

The tracker includes an intelligent data refresh system:

### How It Works

1. **Daily Execution** - Cron job runs at 2 AM (configurable)
2. **News Search** - Queries news APIs for each startup
3. **Data Extraction** - Parses articles for funding, users, valuation
4. **Validation** - Filters for reasonable changes and confidence
5. **Manual Review** - All updates require approval
6. **Apply Changes** - Approved updates modify startup data

### API Endpoints

```bash
POST /api/updates/refresh       # Trigger manual refresh
GET  /api/updates/pending       # View pending updates
GET  /api/updates/summary       # Get stats
POST /api/updates/:id/approve   # Approve update
POST /api/updates/:id/reject    # Reject update
```

### Data Sources

- NewsAPI (100 requests/day free)
- Web scraping (as fallback)
- Manual research and verification

See [docs/AUTOMATED-UPDATES.md](docs/AUTOMATED-UPDATES.md) for full documentation.

## 📁 Data Format

### Startup Entry

```json
{
  "id": "function-health",
  "name": "Function Health",
  "website": "https://functionhealth.com",
  "description": "...",
  "founded": 2021,
  "headquarters": "San Francisco, CA",
  "metrics": {
    "totalFunding": 306000000,
    "lastFundingRound": {
      "amount": 200000000,
      "type": "Series B",
      "date": "2025-02"
    },
    "estimatedUsers": 200000,
    "employeeCount": 150,
    "valuation": 2500000000,
    "revenue": 100000000
  },
  "founders": ["Dr. Mark Hyman", "Pieter Cohen"],
  "keyFeatures": [...],
  "lastUpdated": "2025-11-15"
}
```

## 🎨 Design System

### Colors

```css
--red-primary: #E30613    /* Authentic Red Cross red */
--white: #FFFFFF          /* Clean backgrounds */
--off-white: #F8F8F8      /* Subtle backgrounds */
--mid-gray: #999999       /* Secondary text */
--dark-gray: #333333      /* Primary text */
```

### Typography

- **DM Sans** (300/400/700) - Clean sans for headings/body
- **Space Mono** (400/700) - Technical monospace for data

### Principles

- Minimalism first
- Generous white space
- Red reserved for data/accents
- Functional, not decorative
- Swiss/German design influence

## 📈 Future Enhancements

- [ ] PostgreSQL database migration
- [ ] Real-time websocket updates
- [ ] Email notifications for new updates
- [ ] Advanced filtering and search
- [ ] Export data to CSV/Excel
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Multi-language support
- [ ] Dark mode (optional)

## 🤝 Contributing

This is a personal tracking project, but suggestions are welcome!

1. Fork the repo
2. Create feature branch
3. Make your changes
4. Submit pull request

## 📄 License

MIT License - feel free to use for your own tracking needs!

## 🙏 Acknowledgments

- Data sourced from public announcements and news
- Design inspired by Swiss minimalism
- Built with Claude Code

---

**Live Demo**: Coming soon after deployment!

**Questions?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides.
