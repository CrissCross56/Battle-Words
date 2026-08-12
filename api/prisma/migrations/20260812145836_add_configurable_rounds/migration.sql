/*
  Warnings:

  - You are about to drop the column `answerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `scramble` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `scrambleWinnerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `answerPoints` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `answerSolved` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `answerSolvedAt` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `scramblePoints` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `scrambleSolved` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `scrambleSolvedAt` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `unscrambleStartedAt` on the `GamePlayer` table. All the data in the column will be lost.
  - You are about to drop the column `gamePlayerId` on the `ScrambleGuess` table. All the data in the column will be lost.
  - You are about to drop the column `gamePlayerId` on the `UnscrambleGuess` table. All the data in the column will be lost.
  - Added the required column `totalRounds` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundPlayerId` to the `ScrambleGuess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roundPlayerId` to the `UnscrambleGuess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_scrambleWinnerId_fkey";

-- DropForeignKey
ALTER TABLE "ScrambleGuess" DROP CONSTRAINT "ScrambleGuess_gamePlayerId_fkey";

-- DropForeignKey
ALTER TABLE "UnscrambleGuess" DROP CONSTRAINT "UnscrambleGuess_gamePlayerId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "answerId",
DROP COLUMN "scramble",
DROP COLUMN "scrambleWinnerId",
ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalRounds" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GamePlayer" DROP COLUMN "answerPoints",
DROP COLUMN "answerSolved",
DROP COLUMN "answerSolvedAt",
DROP COLUMN "scramblePoints",
DROP COLUMN "scrambleSolved",
DROP COLUMN "scrambleSolvedAt",
DROP COLUMN "unscrambleStartedAt";

-- AlterTable
ALTER TABLE "ScrambleGuess" DROP COLUMN "gamePlayerId",
ADD COLUMN     "roundPlayerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnscrambleGuess" DROP COLUMN "gamePlayerId",
ADD COLUMN     "roundPlayerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "scramble" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "scrambleWinnerId" TEXT,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoundPlayer" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "gamePlayerId" TEXT NOT NULL,
    "scrambleSolved" BOOLEAN NOT NULL DEFAULT false,
    "scramblePoints" INTEGER NOT NULL DEFAULT 0,
    "scrambleSolvedAt" TIMESTAMP(3),
    "unscrambleStartedAt" TIMESTAMP(3),
    "answerSolved" BOOLEAN NOT NULL DEFAULT false,
    "answerPoints" INTEGER NOT NULL DEFAULT 0,
    "answerSolvedAt" TIMESTAMP(3),
    "totalPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoundPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Round_gameId_endedAt_idx" ON "Round"("gameId", "endedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Round_gameId_roundNumber_key" ON "Round"("gameId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RoundPlayer_roundId_gamePlayerId_key" ON "RoundPlayer"("roundId", "gamePlayerId");

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_scrambleWinnerId_fkey" FOREIGN KEY ("scrambleWinnerId") REFERENCES "RoundPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundPlayer" ADD CONSTRAINT "RoundPlayer_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoundPlayer" ADD CONSTRAINT "RoundPlayer_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "GamePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrambleGuess" ADD CONSTRAINT "ScrambleGuess_roundPlayerId_fkey" FOREIGN KEY ("roundPlayerId") REFERENCES "RoundPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnscrambleGuess" ADD CONSTRAINT "UnscrambleGuess_roundPlayerId_fkey" FOREIGN KEY ("roundPlayerId") REFERENCES "RoundPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
