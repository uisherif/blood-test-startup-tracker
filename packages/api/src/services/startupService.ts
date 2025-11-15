import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { Startup } from '@blood-test-tracker/shared';

const DATA_PATH = join(__dirname, '../../../../data/startups.json');

export async function getStartups(): Promise<Startup[]> {
  const data = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function getStartupById(id: string): Promise<Startup | null> {
  const startups = await getStartups();
  return startups.find(s => s.id === id) || null;
}

export async function updateStartup(id: string, updates: Partial<Startup>): Promise<Startup | null> {
  const startups = await getStartups();
  const index = startups.findIndex(s => s.id === id);

  if (index === -1) {
    return null;
  }

  // Deep merge for metrics
  const updatedStartup = {
    ...startups[index],
    ...updates,
    metrics: {
      ...startups[index].metrics,
      ...(updates.metrics || {})
    },
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  startups[index] = updatedStartup;
  await writeFile(DATA_PATH, JSON.stringify(startups, null, 2));

  return updatedStartup;
}

export async function saveStartups(startups: Startup[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(startups, null, 2));
}
