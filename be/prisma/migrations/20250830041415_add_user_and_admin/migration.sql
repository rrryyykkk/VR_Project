/*
  Warnings:

  - The values [male,female] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('lakiLaki', 'perempuan');
ALTER TABLE "public"."User" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
