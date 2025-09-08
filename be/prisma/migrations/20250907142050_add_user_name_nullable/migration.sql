/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "userName" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "userName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userName_key" ON "public"."Admin"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "public"."User"("userName");
