import { Router } from 'express';
import {
  getPendingUpdates,
  approveUpdate,
  rejectUpdate,
  getUpdatesSummary
} from '../services/updateReviewService';
import { runDataRefresh } from '../services/dataRefresh';

export const updatesRouter = Router();

// GET all pending updates
updatesRouter.get('/pending', async (req, res) => {
  try {
    const updates = await getPendingUpdates();
    const pending = updates.filter(u => u.status === 'pending');
    res.json(pending);
  } catch (error) {
    console.error('Error fetching pending updates:', error);
    res.status(500).json({ error: 'Failed to fetch pending updates' });
  }
});

// GET updates summary
updatesRouter.get('/summary', async (req, res) => {
  try {
    const summary = await getUpdatesSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching updates summary:', error);
    res.status(500).json({ error: 'Failed to fetch updates summary' });
  }
});

// POST approve an update
updatesRouter.post('/:id/approve', async (req, res) => {
  try {
    const { reviewedBy } = req.body;
    if (!reviewedBy) {
      return res.status(400).json({ error: 'reviewedBy is required' });
    }

    await approveUpdate(req.params.id, reviewedBy);
    res.json({ message: 'Update approved successfully' });
  } catch (error) {
    console.error('Error approving update:', error);
    res.status(500).json({ error: 'Failed to approve update' });
  }
});

// POST reject an update
updatesRouter.post('/:id/reject', async (req, res) => {
  try {
    const { reviewedBy, notes } = req.body;
    if (!reviewedBy) {
      return res.status(400).json({ error: 'reviewedBy is required' });
    }

    await rejectUpdate(req.params.id, reviewedBy, notes);
    res.json({ message: 'Update rejected successfully' });
  } catch (error) {
    console.error('Error rejecting update:', error);
    res.status(500).json({ error: 'Failed to reject update' });
  }
});

// POST trigger manual data refresh
updatesRouter.post('/refresh', async (req, res) => {
  try {
    console.log('Manual data refresh triggered via API');
    const result = await runDataRefresh();
    res.json({
      message: 'Data refresh completed',
      ...result
    });
  } catch (error) {
    console.error('Error running data refresh:', error);
    res.status(500).json({ error: 'Failed to run data refresh' });
  }
});
