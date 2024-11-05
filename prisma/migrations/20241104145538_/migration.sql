/*
  Warnings:

  - Changed the type of `priceMember` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priceExternal` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceMember",
ADD COLUMN     "priceMember" INTEGER NOT NULL,
DROP COLUMN "priceExternal",
ADD COLUMN     "priceExternal" INTEGER NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
