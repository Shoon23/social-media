/*
  Warnings:

  - You are about to drop the column `friendId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FriendRequest` table. All the data in the column will be lost.
  - You are about to drop the `FriendSent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "FriendSent" DROP CONSTRAINT "FriendSent_userId_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "friendId",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FriendSent";

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
