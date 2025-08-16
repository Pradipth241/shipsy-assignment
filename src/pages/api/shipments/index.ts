// src/pages/api/shipments/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { readDB, writeDB } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  const db = await readDB();

  switch (req.method) {
    case 'POST':
      const data = req.body;
      const newShipment = {
        id: `ship_${Date.now()}`,
        ...data,
        ownerId: userId,
        createdAt: new Date().toISOString(),
        history: [{ location: data.origin, status: 'PENDING', updatedBy: 'System', timestamp: new Date().toISOString() }],
      };
      db.shipments.push(newShipment);
      await writeDB(db);
      return res.status(201).json(newShipment);

    case 'GET':
      const userShipments = db.shipments.filter(s => s.ownerId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.status(200).json({ data: userShipments });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}