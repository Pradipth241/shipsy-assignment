/*
  Warnings:

  - You are about to drop the column `description` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `volumeCubicMeters` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `destination` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratePerKg` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."ShipmentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "public"."Shipment" DROP COLUMN "description",
DROP COLUMN "volumeCubicMeters",
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "ratePerKg" DOUBLE PRECISION NOT NULL;
