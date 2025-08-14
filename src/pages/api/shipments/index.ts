// pages/api/shipments/index.ts
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
      // Create a new shipment
      try {
        const { description, isFragile, weightInKg, volumeCubicMeters, status } = req.body;

        // --- CALCULATED FIELD ---
        const shippingCost = (weightInKg * 1.5) + (volumeCubicMeters * 3);

        const newShipment = await prisma.shipment.create({
          data: {
            description,
            isFragile,
            weightInKg,
            volumeCubicMeters,
            status,
            shippingCost,
            ownerId: userId,
          },
        });
        return res.status(201).json(newShipment);
      } catch (error) {
        return res.status(500).json({ message: 'Error creating shipment' });
      }

    case 'GET':
      // Get a list of shipments with pagination and filtering
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const statusFilter = req.query.status as string | undefined;

        const whereClause: any = { ownerId: userId };
        if (statusFilter && ['PENDING', 'IN_TRANSIT', 'DELIVERED'].includes(statusFilter)) {
            whereClause.status = statusFilter;
        }

        const shipments = await prisma.shipment.findMany({
          where: whereClause,
          skip: skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        });
        const totalShipments = await prisma.shipment.count({ where: whereClause });

        return res.status(200).json({
          data: shipments,
          pagination: {
            total: totalShipments,
            page,
            limit,
            totalPages: Math.ceil(totalShipments / limit),
          },
        });
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching shipments' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}