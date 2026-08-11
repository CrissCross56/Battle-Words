/*
  Warnings:

  - You are about to drop the column `playerId` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameId,memberId]` on the table `GamePlayer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `GamePlayer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomMemberRole" AS ENUM ('PLAYER', 'SPECTATOR');

-- DropForeignKey
ALTER TABLE "GamePlayer" DROP CONSTRAINT "GamePlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_roomId_fkey";

-- DropIndex
DROP INDEX "GamePlayer_gameId_playerId_key";

-- AlterTable
ALTER TABLE "GamePlayer" DROP COLUMN "playerId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "RoomMember" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "RoomMemberRole" NOT NULL,
    "roomId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_roomId_username_key" ON "RoomMember"("roomId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "GamePlayer_gameId_memberId_key" ON "GamePlayer"("gameId", "memberId");

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "RoomMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
