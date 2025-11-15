import { DashboardStats } from '@blood-test-tracker/shared';
import { getStartups } from './startupService';

export async function getDashboardStats(): Promise<DashboardStats> {
  const startups = await getStartups();

  const totalFunding = startups.reduce((sum, s) =>
    sum + (s.metrics.totalFunding || 0), 0
  );

  const totalUsers = startups.reduce((sum, s) =>
    sum + (s.metrics.estimatedUsers || 0), 0
  );

  const valuations = startups
    .map(s => s.metrics.valuation)
    .filter(v => v !== null) as number[];

  const averageValuation = valuations.length > 0
    ? valuations.reduce((sum, v) => sum + v, 0) / valuations.length
    : 0;

  return {
    totalStartups: startups.length,
    totalFunding,
    totalUsers,
    averageValuation,
    lastUpdated: new Date().toISOString()
  };
}
