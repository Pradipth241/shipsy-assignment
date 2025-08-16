// src/lib/db.ts
import fs from 'fs/promises';
import path from 'path';

// Vercel provides a temporary writable file system at /tmp
const dbPath = path.join('/tmp', 'db.json');

interface DB {
  users: any[];
  shipments: any[];
}

export async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with a default structure
    const defaultData = { users: [], shipments: [] };
    await fs.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function writeDB(data: DB): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}