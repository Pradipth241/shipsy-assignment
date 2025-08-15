// src/pages/api/shipments/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  switch (req.method) {
    case 'POST':
      try {
        const data = req.body;
        const newShipment = await prisma.shipment.create({
          data: {
            ...data,
            ownerId: userId,
            history: {
              create: {
                location: data.origin,
                status: 'PENDING',
                updatedBy: 'System',
                remarks: 'Shipment created.',
              },
            },
          },
        });
        return res.status(201).json(newShipment);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating shipment' });
      }

    case 'GET':
      try {
        const shipments = await prisma.shipment.findMany({
          where: { ownerId: userId },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json({ data: shipments });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching shipments' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}