import { Startup } from '@blood-test-tracker/shared';

export interface NewsResult {
  title: string;
  url: string;
  publishedDate: string;
  source: string;
  snippet: string;
}

export interface DataUpdate {
  startupId: string;
  field: string;
  oldValue: any;
  newValue: any;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: string;
}

/**
 * Search for news about a specific startup
 * In production, this would use a news API like NewsAPI, Google News, or similar
 */
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

  console.log(`\n🔍 Searching news for ${startup.name} from ${fromDateStr}...`);

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
        console.error(`❌ NewsAPI error for query "${query}": ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        console.log(`   ✅ Found ${data.articles.length} articles for "${query}"`);

        results.push(...data.articles.map((article: any) => ({
          title: article.title,
          url: article.url,
          publishedDate: article.publishedAt,
          source: article.source.name,
          snippet: article.description || ''
        })));
      } else {
        console.log(`   ℹ️  No articles found for "${query}"`);
      }
    } catch (error) {
      console.error(`❌ Error searching news for query "${query}":`, error);
    }

    // Small delay between API calls to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`📰 Total articles found for ${startup.name}: ${results.length}\n`);
  return results;
}

/**
 * Search Crunchbase-like sources for funding updates
 */
export async function searchFundingUpdates(startup: Startup): Promise<any[]> {
  // In production, integrate with:
  // - Crunchbase API
  // - PitchBook API
  // - SEC EDGAR for public filings

  console.log(`Checking funding sources for ${startup.name}`);

  // Example:
  /*
  const response = await fetch(
    `https://api.crunchbase.com/v4/entities/organizations/${startup.id}`,
    {
      headers: {
        'X-cb-user-key': process.env.CRUNCHBASE_API_KEY
      }
    }
  );
  */

  return [];
}

/**
 * Parse news articles to extract potential data updates
 */
export function parseNewsForUpdates(news: NewsResult[], startup: Startup): DataUpdate[] {
  const updates: DataUpdate[] = [];

  for (const article of news) {
    const text = `${article.title} ${article.snippet}`.toLowerCase();

    // Detect funding rounds
    const fundingMatch = text.match(/raises?\s+\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)/i);
    if (fundingMatch) {
      const amount = parseFloat(fundingMatch[1]);
      const multiplier = fundingMatch[2].startsWith('b') ? 1000000000 : 1000000;
      const fundingAmount = amount * multiplier;

      updates.push({
        startupId: startup.id,
        field: 'totalFunding',
        oldValue: startup.metrics.totalFunding,
        newValue: fundingAmount,
        source: article.url,
        confidence: 'high',
        timestamp: article.publishedDate
      });
    }

    // Detect valuation
    const valuationMatch = text.match(/valued?\s+at\s+\$(\d+(?:\.\d+)?)\s*(million|billion|m|b)/i);
    if (valuationMatch) {
      const amount = parseFloat(valuationMatch[1]);
      const multiplier = valuationMatch[2].startsWith('b') ? 1000000000 : 1000000;
      const valuation = amount * multiplier;

      updates.push({
        startupId: startup.id,
        field: 'valuation',
        oldValue: startup.metrics.valuation,
        newValue: valuation,
        source: article.url,
        confidence: 'high',
        timestamp: article.publishedDate
      });
    }

    // Detect user/member counts
    const userMatch = text.match(/(\d+(?:,\d+)*)\s*(million|thousand|k|m)?\s+(users|members|customers|subscribers)/i);
    if (userMatch) {
      let count = parseInt(userMatch[1].replace(/,/g, ''));
      const multiplier = userMatch[2];

      if (multiplier) {
        if (multiplier.startsWith('m')) count *= 1000000;
        else if (multiplier.startsWith('k')) count *= 1000;
        else if (multiplier.startsWith('t')) count *= 1000;
      }

      updates.push({
        startupId: startup.id,
        field: 'estimatedUsers',
        oldValue: startup.metrics.estimatedUsers,
        newValue: count,
        source: article.url,
        confidence: 'medium',
        timestamp: article.publishedDate
      });
    }

    // Detect acquisitions
    if (text.includes('acqui') && (text.includes('acquired') || text.includes('acquisition'))) {
      const acquirerMatch = text.match(/([\w\s]+)\s+acquire[sd]\s+${startup.name}/i);
      if (acquirerMatch) {
        updates.push({
          startupId: startup.id,
          field: 'acquisition',
          oldValue: null,
          newValue: {
            acquirer: acquirerMatch[1].trim(),
            date: article.publishedDate
          },
          source: article.url,
          confidence: 'high',
          timestamp: article.publishedDate
        });
      }
    }
  }

  return updates;
}

/**
 * Validate and filter updates based on confidence and recency
 */
export function filterValidUpdates(updates: DataUpdate[]): DataUpdate[] {
  // Remove duplicates, keep most recent and highest confidence
  const updateMap = new Map<string, DataUpdate>();

  for (const update of updates) {
    const key = `${update.startupId}-${update.field}`;
    const existing = updateMap.get(key);

    if (!existing) {
      updateMap.set(key, update);
    } else {
      // Keep the one with higher confidence, or more recent if same confidence
      const confidenceOrder = { high: 3, medium: 2, low: 1 };

      if (confidenceOrder[update.confidence] > confidenceOrder[existing.confidence]) {
        updateMap.set(key, update);
      } else if (
        confidenceOrder[update.confidence] === confidenceOrder[existing.confidence] &&
        new Date(update.timestamp) > new Date(existing.timestamp)
      ) {
        updateMap.set(key, update);
      }
    }
  }

  // Only return updates that have meaningful changes
  return Array.from(updateMap.values()).filter(update => {
    // Skip if old and new values are the same
    if (update.oldValue === update.newValue) return false;

    // Skip if new value seems unreasonable (too small or too large compared to old)
    if (update.field === 'totalFunding' || update.field === 'valuation') {
      const oldVal = update.oldValue as number || 0;
      const newVal = update.newValue as number;

      // Funding should only increase, not decrease by more than 10%
      if (newVal < oldVal * 0.9) return false;

      // Ignore if change is less than 5%
      if (Math.abs(newVal - oldVal) / Math.max(oldVal, 1) < 0.05) return false;
    }

    return true;
  });
}
