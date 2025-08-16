/*
  Warnings:

  - Added the required column `ratePerKg` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Shipment" ADD COLUMN     "isFragile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ratePerKg" DOUBLE PRECISION NOT NULL;
