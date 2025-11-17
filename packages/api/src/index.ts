import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startupsRouter } from './routes/startups';
import { statsRouter } from './routes/stats';
import { updatesRouter } from './routes/updates';
import { historyRouter } from './routes/history';
import { startDataRefreshJob } from './services/dataRefresh';
import { requireApiKey, logAuthenticatedRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Restrict to specific domains
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000', 'http://localhost:5173']; // Default to local dev

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use(express.json());

// Public Routes (no authentication required)
app.use('/api/startups', startupsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/history', historyRouter);

// Protected Admin Routes (require API key)
app.use('/api/updates', requireApiKey, logAuthenticatedRequest, updatesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`\n🌐 CORS allowed origins:`, allowedOrigins.join(', '));

  if (!process.env.ADMIN_API_KEY) {
    console.warn(`\n⚠️  WARNING: ADMIN_API_KEY not set!`);
    console.warn(`Admin endpoints are unprotected in development mode.`);
    console.warn(`Set ADMIN_API_KEY in .env for production deployment.\n`);
  } else {
    console.log(`\n🔒 Admin endpoints protected with API key\n`);
  }

  console.log(`Available endpoints:`);
  console.log(`\nPublic (no auth required):`);
  console.log(`  GET  /api/startups - List all startups`);
  console.log(`  GET  /api/stats - Dashboard statistics`);
  console.log(`  GET  /api/history - Historical data`);
  console.log(`\nProtected (requires x-api-key header):`);
  console.log(`  GET  /api/updates/pending - View pending updates`);
  console.log(`  GET  /api/updates/summary - Updates summary`);
  console.log(`  POST /api/updates/refresh - Trigger manual data refresh`);
  console.log(`  POST /api/updates/:id/approve - Approve an update`);
  console.log(`  POST /api/updates/:id/reject - Reject an update\n`);

  // Start background data refresh job
  startDataRefreshJob();
});
