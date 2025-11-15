import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { DataUpdate } from './newsSearchService';

const PENDING_UPDATES_PATH = join(__dirname, '../../../../data/pending-updates.json');

export interface PendingUpdate extends DataUpdate {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

/**
 * Load pending updates from file
 */
export async function getPendingUpdates(): Promise<PendingUpdate[]> {
  try {
    const data = await readFile(PENDING_UPDATES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

/**
 * Save a new update for review
 */
export async function savePendingUpdate(update: DataUpdate): Promise<PendingUpdate> {
  const pending = await getPendingUpdates();

  const pendingUpdate: PendingUpdate = {
    ...update,
    id: `${update.startupId}-${update.field}-${Date.now()}`,
    status: 'pending'
  };

  pending.push(pendingUpdate);
  await writeFile(PENDING_UPDATES_PATH, JSON.stringify(pending, null, 2));

  return pendingUpdate;
}

/**
 * Approve an update and apply it to the startup data
 */
export async function approveUpdate(updateId: string, reviewedBy: string): Promise<void> {
  const pending = await getPendingUpdates();
  const update = pending.find(u => u.id === updateId);

  if (!update) {
    throw new Error(`Update ${updateId} not found`);
  }

  update.status = 'approved';
  update.reviewedAt = new Date().toISOString();
  update.reviewedBy = reviewedBy;

  await writeFile(PENDING_UPDATES_PATH, JSON.stringify(pending, null, 2));

  // TODO: Apply the update to the actual startup data
  console.log(`Update ${updateId} approved by ${reviewedBy}`);
}

/**
 * Reject an update
 */
export async function rejectUpdate(updateId: string, reviewedBy: string, notes?: string): Promise<void> {
  const pending = await getPendingUpdates();
  const update = pending.find(u => u.id === updateId);

  if (!update) {
    throw new Error(`Update ${updateId} not found`);
  }

  update.status = 'rejected';
  update.reviewedAt = new Date().toISOString();
  update.reviewedBy = reviewedBy;
  update.notes = notes;

  await writeFile(PENDING_UPDATES_PATH, JSON.stringify(pending, null, 2));

  console.log(`Update ${updateId} rejected by ${reviewedBy}`);
}

/**
 * Get summary of pending updates
 */
export async function getUpdatesSummary(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  byStartup: Record<string, number>;
}> {
  const updates = await getPendingUpdates();

  const summary = {
    pending: updates.filter(u => u.status === 'pending').length,
    approved: updates.filter(u => u.status === 'approved').length,
    rejected: updates.filter(u => u.status === 'rejected').length,
    byStartup: {} as Record<string, number>
  };

  for (const update of updates) {
    if (update.status === 'pending') {
      summary.byStartup[update.startupId] = (summary.byStartup[update.startupId] || 0) + 1;
    }
  }

  return summary;
}
