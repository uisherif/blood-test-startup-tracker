import { Router } from 'express';
import { getStartups, getStartupById, updateStartup } from '../services/startupService';

export const startupsRouter = Router();

// GET all startups
startupsRouter.get('/', async (req, res) => {
  try {
    const startups = await getStartups();
    res.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    res.status(500).json({ error: 'Failed to fetch startups' });
  }
});

// GET single startup by ID
startupsRouter.get('/:id', async (req, res) => {
  try {
    const startup = await getStartupById(req.params.id);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }
    res.json(startup);
  } catch (error) {
    console.error('Error fetching startup:', error);
    res.status(500).json({ error: 'Failed to fetch startup' });
  }
});

// PATCH update startup metrics
startupsRouter.patch('/:id', async (req, res) => {
  try {
    const updatedStartup = await updateStartup(req.params.id, req.body);
    if (!updatedStartup) {
      return res.status(404).json({ error: 'Startup not found' });
    }
    res.json(updatedStartup);
  } catch (error) {
    console.error('Error updating startup:', error);
    res.status(500).json({ error: 'Failed to update startup' });
  }
});
