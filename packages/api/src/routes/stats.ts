import { Router } from 'express';
import { getDashboardStats } from '../services/statsService';

export const statsRouter = Router();

// GET dashboard statistics
statsRouter.get('/', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});
