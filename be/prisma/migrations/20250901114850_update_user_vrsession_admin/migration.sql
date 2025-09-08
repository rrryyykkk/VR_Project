-- AlterTable
ALTER TABLE "public"."Admin" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."VRSession" ALTER COLUMN "updatedAt" DROP DEFAULT;
