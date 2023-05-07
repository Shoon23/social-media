-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_id_fkey";

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
