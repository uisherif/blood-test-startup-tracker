import { DashboardStats } from '@blood-test-tracker/shared';

interface DashboardProps {
  stats: DashboardStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="dashboard">
      <div className="stat-card">
        <div className="stat-label">Total Startups</div>
        <div className="stat-value">{stats.totalStartups}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Funding</div>
        <div className="stat-value">{formatCurrency(stats.totalFunding)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Users</div>
        <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg Valuation</div>
        <div className="stat-value">
          {stats.averageValuation > 0 ? formatCurrency(stats.averageValuation) : 'N/A'}
        </div>
      </div>
    </div>
  );
}
