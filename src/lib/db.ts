// src/lib/db.ts
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Define the shape of our temporary data to satisfy TypeScript
export interface TempUser {
    id: string;
    username: string;
    password: string; 
}

export interface TempShipment {
    id: string;
    ownerId: string;
    [key: string]: any; // This allows any other properties from the form
}

interface DB {
  users: TempUser[];
  shipments: TempShipment[];
}

const dbPath = path.join(os.tmpdir(), 'db.json');

export async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (_error) { // Fix for unused variable
    const defaultData = { users: [], shipments: [] };
    await fs.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function writeDB(data: DB): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}