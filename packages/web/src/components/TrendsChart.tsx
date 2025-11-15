import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoricalDataPoint {
  date: string;
  totalFunding: number | null;
  estimatedUsers: number | null;
  valuation: number | null;
  revenue: number | null;
}

interface StartupHistory {
  brandColor: string;
  history: HistoricalDataPoint[];
}

type MetricType = 'totalFunding' | 'estimatedUsers' | 'valuation' | 'revenue';

export function TrendsChart() {
  const [historicalData, setHistoricalData] = useState<Record<string, StartupHistory>>({});
  const [activeTab, setActiveTab] = useState<MetricType>('estimatedUsers');
  const [loading, setLoading] = useState(true);
  const [useLogScale, setUseLogScale] = useState(false);

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  async function fetchHistoricalData() {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatChartData = () => {
    if (!historicalData || Object.keys(historicalData).length === 0) return [];

    // Get all unique dates
    const allDates = new Set<string>();
    Object.values(historicalData).forEach(startup => {
      startup.history.forEach(point => allDates.add(point.date));
    });

    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint: any = { date: formatDate(date) };

      Object.entries(historicalData).forEach(([id, startup]) => {
        const point = startup.history.find(h => h.date === date);
        if (point && point[activeTab] !== null && point[activeTab] !== undefined) {
          dataPoint[id] = point[activeTab];
        } else {
          // Set to null instead of undefined to maintain line continuity
          dataPoint[id] = null;
        }
      });

      return dataPoint;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatValue = (value: number) => {
    if (activeTab === 'totalFunding' || activeTab === 'valuation' || activeTab === 'revenue') {
      // Format as currency
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(0)}M`;
      }
      return `$${value.toLocaleString()}`;
    } else {
      // Format as number
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toLocaleString();
    }
  };

  const getStartupName = (id: string) => {
    const names: Record<string, string> = {
      'function-health': 'Function Health',
      'insidetracker': 'InsideTracker',
      'everlywell': 'Everlywell',
      'thorne-health': 'Thorne',
      'superpower': 'Superpower',
      'grail': 'GRAIL'
    };
    return names[id] || id;
  };

  const tabs = [
    { key: 'estimatedUsers' as MetricType, label: 'Users' },
    { key: 'totalFunding' as MetricType, label: 'Funding' },
    { key: 'valuation' as MetricType, label: 'Valuation' },
    { key: 'revenue' as MetricType, label: 'Revenue' }
  ];

  const chartData = formatChartData();

  if (loading) {
    return (
      <div className="trends-chart loading">
        <p>Loading trends...</p>
      </div>
    );
  }

  return (
    <div className="trends-chart">
      <h2>Growth Trends</h2>

      <div className="chart-controls">
        <div className="chart-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="scale-toggle">
          <label>
            <input
              type="checkbox"
              checked={useLogScale}
              onChange={(e) => setUseLogScale(e.target.checked)}
            />
            <span>Log Scale</span>
          </label>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatValue}
              scale={useLogScale ? 'log' : 'auto'}
              domain={useLogScale ? ['auto', 'auto'] : [0, 'auto']}
              allowDataOverflow={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => formatValue(value)}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => getStartupName(value)}
            />
            {Object.entries(historicalData).map(([id, startup]) => {
              // Only render line if startup has at least one non-null value for this metric
              const hasData = startup.history.some(point => point[activeTab] !== null && point[activeTab] !== undefined);
              if (!hasData) return null;

              return (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={startup.brandColor}
                  strokeWidth={3}
                  dot={{ r: 5, fill: startup.brandColor }}
                  activeDot={{ r: 8 }}
                  name={getStartupName(id)}
                  connectNulls={true}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-info">
        <p className="text-secondary">
          {activeTab === 'estimatedUsers' && (useLogScale
            ? 'Log scale shows growth rates more clearly when values differ greatly'
            : 'Tracking user/member growth over time')}
          {activeTab === 'totalFunding' && (useLogScale
            ? 'Log scale helps compare funding growth rates across companies'
            : 'Total funding raised including all rounds')}
          {activeTab === 'valuation' && (useLogScale
            ? 'Log scale reveals valuation trends for companies at different stages'
            : 'Company valuation at different funding rounds')}
          {activeTab === 'revenue' && (useLogScale
            ? 'Log scale shows revenue growth rates more clearly'
            : 'Annual revenue run rate')}
        </p>
      </div>
    </div>
  );
}
