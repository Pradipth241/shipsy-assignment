// pages/api/shipments/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = getUserIdFromToken(token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  const { id } = req.query;

  // Ensure the shipment belongs to the user trying to access it
  const shipment = await prisma.shipment.findFirst({
    where: { id: String(id), ownerId: userId },
  });

  if (!shipment) {
    return res.status(404).json({ message: 'Shipment not found or access denied' });
  }

  switch (req.method) {
    case 'GET':
      return res.status(200).json(shipment);

    case 'PUT': // Update a shipment
      try {
        const { destination, status, weightInKg, ratePerKg } = req.body;
        // --- RE-CALCULATE COST ON UPDATE ---
        const shippingCost = Number(weightInKg) * Number(ratePerKg);

        const updatedShipment = await prisma.shipment.update({
          where: { id: String(id) },
          data: {
            destination,
            status,
            weightInKg: Number(weightInKg),
            ratePerKg: Number(ratePerKg),
            shippingCost,
          },
        });
        return res.status(200).json(updatedShipment);
      } catch (error) {
        return res.status(500).json({ message: 'Error updating shipment' });
      }

    case 'DELETE': // Delete a shipment
      try {
        await prisma.shipment.delete({ where: { id: String(id) } });
        return res.status(204).end(); // No Content
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting shipment' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}