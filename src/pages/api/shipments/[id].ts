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

  // First, verify the shipment exists and belongs to the user for all methods
  const shipment = await prisma.shipment.findFirst({
    where: { id: String(id), ownerId: userId },
  });

  if (!shipment && req.method !== 'GET') { // Allow GET to fail with a 404 inside the switch
    return res.status(404).json({ message: 'Shipment not found or access denied' });
  }

  switch (req.method) {
    case 'GET':
      // Fetch a single shipment with its history
      try {
        const shipmentWithHistory = await prisma.shipment.findFirst({
          where: { id: String(id), ownerId: userId },
          include: {
            history: {
              orderBy: { timestamp: 'desc' },
            },
          },
        });
        if (!shipmentWithHistory) return res.status(404).json({ message: 'Shipment not found' });
        return res.status(200).json(shipmentWithHistory);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching shipment' });
      }

    case 'PUT':
      // Update a shipment
      try {
        const data = req.body;
        const updatedShipment = await prisma.shipment.update({
          where: { id: String(id) },
          data: {
            ...data,
            history: {
              create: {
                location: data.destination,
                status: data.status,
                updatedBy: 'User',
                remarks: `Status updated to ${data.status}.`,
              },
            },
          },
        });
        return res.status(200).json(updatedShipment);
      } catch (error) {
        return res.status(500).json({ message: 'Error updating shipment' });
      }

    case 'DELETE':
      // Delete a shipment
      try {
        await prisma.shipmentHistory.deleteMany({
            where: { shipmentId: String(id) }
        });
        await prisma.shipment.delete({
          where: { id: String(id) },
        });
        return res.status(204).end(); // Success, no content
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting shipment' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}