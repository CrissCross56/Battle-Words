/*
  Warnings:

  - Added the required column `totalRounds` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "totalRounds" INTEGER NOT NULL;
