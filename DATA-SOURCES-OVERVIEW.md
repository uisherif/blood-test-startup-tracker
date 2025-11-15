# Data Sources Overview

## Currently Active Sources

### ✅ NewsAPI (ACTIVE)
**Status**: Integrated and working
**API Key**: Configured
**Coverage**: Global news from 80,000+ sources
**Free Tier**: 100 requests/day
**Cost**: $449/month for unlimited (paid tier)

**Sources Include**:
- TechCrunch
- Bloomberg
- Forbes
- Business Insider
- The Wall Street Journal
- Reuters
- Associated Press
- VentureBeat
- Crunchbase News
- And 80,000+ more

**What We Search For**:
- Funding announcements ("raises", "Series A/B/C")
- Valuations ("valued at")
- User/member milestones
- Acquisitions
- Major company updates

**Update Frequency**: Daily at 2 AM (configurable)

---

## Ready to Integrate (Not Yet Active)

### 🔄 Crunchbase API
**Status**: Ready for integration
**Purpose**: Authoritative funding and company data
**API Key**: Not yet configured
**Cost**: Enterprise pricing (contact sales)

**Data Available**:
- Official funding rounds
- Investor information
- Company profiles
- Valuations
- Employee counts
- Acquisitions

**How to Enable**:
```bash
# Get API key from Crunchbase
echo "CRUNCHBASE_API_KEY=your_key" >> packages/api/.env

# Uncomment integration code in searchFundingUpdates()
```

---

### 🔄 Google News API
**Status**: Ready for integration
**Purpose**: Broader news coverage
**API Key**: Not yet configured
**Cost**: Free tier available

**Benefits**:
- Complementary to NewsAPI
- Different source coverage
- Real-time updates
- Customizable search

**How to Enable**:
```bash
# Get API key from Google Cloud Console
echo "GOOGLE_API_KEY=your_key" >> packages/api/.env
echo "GOOGLE_CSE_ID=your_cse_id" >> packages/api/.env

# Implement in newsSearchService.ts
```

---

### 🔄 PitchBook API
**Status**: Planned
**Purpose**: Detailed private company financials
**API Key**: Not yet configured
**Cost**: Enterprise only

**Data Available**:
- Detailed funding history
- Valuation estimates
- Investor relationships
- Market analysis
- Industry comparisons

---

### 🔄 LinkedIn Company API
**Status**: Planned
**Purpose**: Employee growth tracking
**API Key**: Not yet configured
**Cost**: Varies by plan

**Metrics Tracked**:
- Employee count changes
- Hiring velocity
- Job postings
- Company growth signals

---

### 🔄 Twitter/X API
**Status**: Planned
**Purpose**: Real-time announcements
**API Key**: Not yet configured
**Cost**: $100/month (basic tier)

**Use Cases**:
- Company announcements
- Founder updates
- Product launches
- Community sentiment

---

## Data Quality & Confidence Levels

### High Confidence Sources
✅ Official press releases
✅ Company announcements
✅ Major financial news outlets (WSJ, Bloomberg, Forbes)
✅ Crunchbase official data
✅ SEC filings (for public companies)

### Medium Confidence Sources
⚠️ Tech news blogs
⚠️ Industry publications
⚠️ Aggregated reports
⚠️ Social media (verified accounts)

### Low Confidence Sources
❌ Unverified blogs
❌ Speculation articles
❌ Social media rumors
❌ Outdated information

---

## How Data Flows Through the System

```
┌─────────────────────────────────────────┐
│  External Data Sources                  │
│  • NewsAPI (80k+ sources)               │
│  • Crunchbase (when enabled)            │
│  • Google News (when enabled)           │
│  • LinkedIn (planned)                   │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  Daily Automated Search (2 AM)          │
│  • Query each startup                   │
│  • Search for: funding, valuation,      │
│    users, acquisitions                  │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  Smart Parsing & Extraction             │
│  • Regex pattern matching               │
│  • Extract numbers and metrics          │
│  • Identify update type                 │
│  • Assign confidence score              │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  Validation & Filtering                 │
│  • Remove duplicates                    │
│  • Verify reasonable changes            │
│  • Check significance (>5% change)      │
│  • Filter by confidence threshold       │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  Pending Updates Queue                  │
│  • Store in pending-updates.json        │
│  • Track source and timestamp           │
│  • Await manual review                  │
└──────────────┬──────────────────────────┘
               │
               v
┌─────────────────────────────────────────┐
│  Manual Review (You)                    │
│  • View pending updates                 │
│  • Check source article                 │
│  • Approve or reject                    │
│  • Add review notes                     │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      v                 v
┌──────────┐    ┌──────────────┐
│ Approved │    │   Rejected   │
│ ↓        │    │ (Discarded)  │
│ Update   │    └──────────────┘
│ data/    │
│ startups │
│ .json    │
└──────────┘
```

---

## Current Search Patterns

### Funding Searches
- `"[Startup Name] funding"`
- `"[Startup Name] raises"`
- `"[Startup Name] Series A/B/C/D"`

### Valuation Searches
- `"[Startup Name] valuation"`
- `"valued at"`

### User Metrics
- `"[Startup Name] users"`
- `"[Startup Name] members"`
- `"[Startup Name] customers"`

### Acquisitions
- `"[Startup Name] acquisition"`
- `"acquired by"`

---

## Detection Patterns (Regex)

### Funding Amounts
```regex
raises?\s+\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)
```
**Example matches**:
- "raises $50 million"
- "raised $2.5 billion"
- "raise $100M"

### Valuations
```regex
valued?\s+at\s+\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)
```
**Example matches**:
- "valued at $2.5 billion"
- "valuation of $500 million"

### User Counts
```regex
(\d+(?:,\d+)*)\s*(million|thousand|k|m)?\s+(users|members|customers)
```
**Example matches**:
- "200,000 members"
- "60 million users"
- "1M customers"

---

## API Usage & Rate Limits

### NewsAPI (Current)
- **Free Tier**: 100 requests/day
- **Current Usage**: ~24 requests/day (4 startups × 6 queries)
- **Remaining**: 76 requests/day for growth
- **Cost to Upgrade**: $449/month unlimited

### Optimization Strategies
1. **Cache results** for 24 hours
2. **Batch queries** when possible
3. **Smart scheduling** (check high-activity times)
4. **Incremental startups** (add slowly to stay under limits)

---

## Adding More Startups

With current free tier (100 requests/day):
- **4 startups**: 24 requests/day ✅ (current)
- **10 startups**: 60 requests/day ✅
- **15 startups**: 90 requests/day ✅
- **20 startups**: 120 requests/day ❌ (need paid tier)

**Recommendation**: Stay under 15 startups on free tier

---

## Data Freshness

| Metric | Update Frequency | Source |
|--------|-----------------|---------|
| Funding Rounds | Daily checks | NewsAPI + Crunchbase |
| Valuations | Daily checks | NewsAPI |
| User Counts | Weekly typical | Company announcements |
| Employee Count | Monthly | LinkedIn (when enabled) |
| Acquisitions | Immediate | News alerts |

---

## Future Enhancements

### Planned Integrations
1. **RSS Feeds** - Company blogs and press pages
2. **SEC EDGAR** - Public company filings
3. **AngelList** - Startup profiles
4. **Product Hunt** - Product launches
5. **Y Combinator** - Batch announcements

### Planned Features
1. **Webhook notifications** (Slack, Discord, Email)
2. **Historical data tracking** (trend analysis)
3. **Confidence scoring ML** (improve accuracy)
4. **Auto-approve trusted sources** (reduce manual work)
5. **Alert thresholds** (notify on major changes)

---

## Data Accuracy

### Current Performance (Expected)
- **Detection Rate**: 70-80% of major announcements
- **False Positive Rate**: 10-20%
- **Data Freshness**: Within 24 hours of announcement
- **Coverage**: Major news outlets + tech press

### With Full Integration
- **Detection Rate**: 90-95%
- **False Positive Rate**: 5-10%
- **Data Freshness**: Near real-time (<1 hour)
- **Coverage**: Comprehensive multi-source

---

## Cost Breakdown

### Free Tier (Current)
- NewsAPI: $0/month (100 requests/day)
- **Total**: $0/month

### Starter Tier
- NewsAPI: $449/month (unlimited)
- **Total**: $449/month

### Professional Tier
- NewsAPI: $449/month
- Crunchbase: $500-2000/month
- Twitter API: $100/month
- **Total**: $1,049-2,549/month

### Enterprise Tier
- NewsAPI: $449/month
- Crunchbase: Custom pricing
- PitchBook: Custom pricing
- Twitter API: $100/month
- LinkedIn: Custom pricing
- **Total**: $3,000-10,000/month

---

## Recommendations

### Immediate (Week 1)
✅ Use free NewsAPI tier (DONE)
✅ Test with 4 startups (DONE)
✅ Refine detection patterns based on results
✅ Build review workflow habits

### Short Term (Month 1)
- Add 5-10 more startups (stay under free limit)
- Track approval/rejection rates
- Tune confidence thresholds
- Document false positive patterns

### Medium Term (Months 2-3)
- Evaluate upgrade to paid NewsAPI
- Test Crunchbase API integration
- Implement RSS feed monitoring
- Add email notifications

### Long Term (Months 4-6)
- Full multi-source integration
- Machine learning for parsing
- Historical trend analysis
- Public API for data access
