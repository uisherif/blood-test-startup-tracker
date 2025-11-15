import { Router } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const historyRouter = Router();

const HISTORY_PATH = join(__dirname, '../../../../data/historical-data.json');

// GET historical data for all startups
historyRouter.get('/', async (req, res) => {
  try {
    const data = await readFile(HISTORY_PATH, 'utf-8');
    const history = JSON.parse(data);
    res.json(history);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// GET historical data for a specific startup
historyRouter.get('/:id', async (req, res) => {
  try {
    const data = await readFile(HISTORY_PATH, 'utf-8');
    const history = JSON.parse(data);

    if (!history[req.params.id]) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    res.json(history[req.params.id]);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});
