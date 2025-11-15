import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startupsRouter } from './routes/startups';
import { statsRouter } from './routes/stats';
import { updatesRouter } from './routes/updates';
import { historyRouter } from './routes/history';
import { startDataRefreshJob } from './services/dataRefresh';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/startups', startupsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/updates', updatesRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /api/startups - List all startups`);
  console.log(`  GET  /api/stats - Dashboard statistics`);
  console.log(`  GET  /api/updates/pending - View pending updates`);
  console.log(`  GET  /api/updates/summary - Updates summary`);
  console.log(`  POST /api/updates/refresh - Trigger manual data refresh`);
  console.log(`  POST /api/updates/:id/approve - Approve an update`);
  console.log(`  POST /api/updates/:id/reject - Reject an update\n`);

  // Start background data refresh job
  startDataRefreshJob();
});
