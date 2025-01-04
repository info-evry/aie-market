/*
  Warnings:

  - Added the required column `quantity` to the `Consumption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consumption" ADD COLUMN     "quantity" INTEGER NOT NULL;
