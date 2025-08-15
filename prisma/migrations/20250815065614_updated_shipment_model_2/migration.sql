/*
  Warnings:

  - You are about to drop the column `isFragile` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `ratePerKg` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `weightInKg` on the `Shipment` table. All the data in the column will be lost.
  - The `status` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `carrier` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedDeliveryDate` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packages` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupDate` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverAddress` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverEmail` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverPhone` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperAddress` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperEmail` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperName` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipperPhone` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFreight` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfShipment` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ShipmentType" AS ENUM ('DOOR_TO_DOOR', 'DOOR_TO_PORT', 'PORT_TO_DOOR');

-- CreateEnum
CREATE TYPE "public"."PaymentMode" AS ENUM ('PREPAID', 'POSTPAID', 'CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "public"."ShipmentMode" AS ENUM ('AIR', 'OCEAN', 'LAND');

-- AlterTable
ALTER TABLE "public"."Shipment" DROP COLUMN "isFragile",
DROP COLUMN "ratePerKg",
DROP COLUMN "shippingCost",
DROP COLUMN "weightInKg",
ADD COLUMN     "carrier" TEXT NOT NULL,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mode" "public"."ShipmentMode" NOT NULL,
ADD COLUMN     "packages" INTEGER NOT NULL,
ADD COLUMN     "paymentMode" "public"."PaymentMode" NOT NULL,
ADD COLUMN     "pickupDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "receiverAddress" TEXT NOT NULL,
ADD COLUMN     "receiverEmail" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "receiverPhone" TEXT NOT NULL,
ADD COLUMN     "shipperAddress" TEXT NOT NULL,
ADD COLUMN     "shipperEmail" TEXT NOT NULL,
ADD COLUMN     "shipperName" TEXT NOT NULL,
ADD COLUMN     "shipperPhone" TEXT NOT NULL,
ADD COLUMN     "totalFreight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "typeOfShipment" "public"."ShipmentType" NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."ShipmentStatus";

-- CreateTable
CREATE TABLE "public"."ShipmentHistory" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "remarks" TEXT,
    "shipmentId" TEXT NOT NULL,

    CONSTRAINT "ShipmentHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ShipmentHistory" ADD CONSTRAINT "ShipmentHistory_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "public"."Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
