import { useEffect, useState } from 'react';
import { Startup, DashboardStats } from '@blood-test-tracker/shared';
import { Dashboard } from './components/Dashboard';
import { StartupCard } from './components/StartupCard';
import { Header } from './components/Header';
import { TrendsChart } from './components/TrendsChart';
import './App.css';

function App() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [startupsRes, statsRes] = await Promise.all([
        fetch('/api/startups'),
        fetch('/api/stats')
      ]);

      if (!startupsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const startupsData = await startupsRes.json();
      const statsData = await statsRes.json();

      setStartups(startupsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading startup data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      {stats && <Dashboard stats={stats} />}
      <TrendsChart />
      <div className="startups-grid">
        {startups.map(startup => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </div>
  );
}

export default App;
