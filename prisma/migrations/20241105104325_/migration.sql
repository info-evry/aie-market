/*
  Warnings:

  - A unique constraint covering the columns `[checkoutSessionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_checkoutSessionId_key" ON "Transaction"("checkoutSessionId");
