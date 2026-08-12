-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "scrambleWinnerId" TEXT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_scrambleWinnerId_fkey" FOREIGN KEY ("scrambleWinnerId") REFERENCES "GamePlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
