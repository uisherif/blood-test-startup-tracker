import cron from 'node-cron';
import { getStartups } from './startupService';
import { searchStartupNews, parseNewsForUpdates, filterValidUpdates, DataUpdate } from './newsSearchService';
import { savePendingUpdate } from './updateReviewService';

/**
 * Run the data refresh process manually
 */
export async function runDataRefresh(): Promise<{
  startupsChecked: number;
  updatesFound: number;
  updates: DataUpdate[];
}> {
  console.log('Starting data refresh job...');

  const startups = await getStartups();
  console.log(`Checking ${startups.length} startups for updates...`);

  const allUpdates: DataUpdate[] = [];

  for (const startup of startups) {
    try {
      console.log(`Searching news for ${startup.name}...`);

      // Search for news from the last 30 days (for demo purposes, change to 1 for daily production)
      const news = await searchStartupNews(startup, 30);
      console.log(`Found ${news.length} news articles for ${startup.name}`);

      // Parse news for potential updates
      const updates = parseNewsForUpdates(news, startup);
      console.log(`Extracted ${updates.length} potential updates from news`);

      // Filter valid updates
      const validUpdates = filterValidUpdates(updates);
      console.log(`${validUpdates.length} valid updates after filtering`);

      // Save each update for manual review
      for (const update of validUpdates) {
        await savePendingUpdate(update);
        allUpdates.push(update);
        console.log(`Saved pending update for ${startup.name}: ${update.field}`);
      }

      // Small delay between startups to be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error processing ${startup.name}:`, error);
    }
  }

  console.log(`Data refresh completed. Found ${allUpdates.length} updates for review.`);

  return {
    startupsChecked: startups.length,
    updatesFound: allUpdates.length,
    updates: allUpdates
  };
}

/**
 * Background job to refresh startup data periodically
 */
export function startDataRefreshJob() {
  // Run every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      await runDataRefresh();
    } catch (error) {
      console.error('Error in scheduled data refresh job:', error);
    }
  });

  console.log('Data refresh job scheduled (daily at 2 AM)');
  console.log('You can also trigger manual refresh via POST /api/data-refresh');
}
