import { Startup } from '@blood-test-tracker/shared';

interface StartupCardProps {
  startup: Startup;
}

export function StartupCard({ startup }: StartupCardProps) {
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="startup-card">
      <div className="startup-header">
        <h2>{startup.name}</h2>
        <a href={startup.website} target="_blank" rel="noopener noreferrer" className="website-link">
          Visit Site →
        </a>
      </div>

      <p className="description">{startup.description}</p>

      <div className="startup-info">
        <div className="info-row">
          <span className="label">Founded:</span>
          <span className="value">{startup.founded}</span>
        </div>
        {startup.headquarters && (
          <div className="info-row">
            <span className="label">HQ:</span>
            <span className="value">{startup.headquarters}</span>
          </div>
        )}
      </div>

      <div className="metrics">
        <h3>Metrics</h3>
        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">Total Funding</div>
            <div className="metric-value">{formatCurrency(startup.metrics.totalFunding)}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Users</div>
            <div className="metric-value">{formatNumber(startup.metrics.estimatedUsers)}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Employees</div>
            <div className="metric-value">{formatNumber(startup.metrics.employeeCount)}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Valuation</div>
            <div className="metric-value">{formatCurrency(startup.metrics.valuation)}</div>
          </div>
        </div>
      </div>

      {startup.keyFeatures && startup.keyFeatures.length > 0 && (
        <div className="features">
          <h4>Key Features</h4>
          <ul>
            {startup.keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="last-updated">
        Last updated: {startup.lastUpdated}
      </div>
    </div>
  );
}
