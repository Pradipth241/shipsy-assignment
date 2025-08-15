// src/pages/api/shipments/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const shipment = await prisma.shipment.findFirst({
        where: { id: String(id), ownerId: userId },
        include: {
          history: {
            orderBy: {
              timestamp: 'desc',
            },
          },
        },
      });

      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
      return res.status(200).json(shipment);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching shipment details' });
    }
  }

  // Add PUT and DELETE methods here later if needed

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}