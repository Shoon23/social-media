/*
  Warnings:

  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_userId_fkey";

-- DropTable
DROP TABLE "Friends";

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userId_key" ON "Friend"("userId");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
