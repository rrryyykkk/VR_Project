/*
  Warnings:

  - You are about to drop the column `lastActivity` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "lastActivity",
ADD COLUMN     "lastActive" TIMESTAMP(3);
