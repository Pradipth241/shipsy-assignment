// src/pages/api/shipments/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { readDB, writeDB } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  const db = await readDB();
  const { id } = req.query;
  const shipmentIndex = db.shipments.findIndex(s => s.id === id && s.ownerId === userId);
  
  if (shipmentIndex === -1) return res.status(404).json({ message: 'Shipment not found' });
  
  switch (req.method) {
    case 'GET':
      return res.status(200).json(db.shipments[shipmentIndex]);
    case 'PUT':
      const originalShipment = db.shipments[shipmentIndex];
      const updatedData = req.body;
      db.shipments[shipmentIndex] = { ...originalShipment, ...updatedData };
      if (originalShipment.status !== updatedData.status) {
        if(!db.shipments[shipmentIndex].history) {
            db.shipments[shipmentIndex].history = [];
        }
        db.shipments[shipmentIndex].history.push({
            location: updatedData.destination,
            status: updatedData.status,
            updatedBy: 'User',
            timestamp: new Date().toISOString()
        });
      }
      await writeDB(db);
      return res.status(200).json(db.shipments[shipmentIndex]);
    case 'DELETE':
      db.shipments.splice(shipmentIndex, 1);
      await writeDB(db);
      return res.status(204).end();
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}