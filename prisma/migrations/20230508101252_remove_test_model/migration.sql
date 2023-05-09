/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTodo" DROP CONSTRAINT "UserTodo_todoId_fkey";

-- DropForeignKey
ALTER TABLE "UserTodo" DROP CONSTRAINT "UserTodo_userId_fkey";

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "UserTodo";
