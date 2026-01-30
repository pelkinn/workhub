-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditLogAction" ADD VALUE 'INVITE_CREATED';
ALTER TYPE "AuditLogAction" ADD VALUE 'INVITE_ACCEPTED';
ALTER TYPE "AuditLogAction" ADD VALUE 'ROLE_CHANGED';
ALTER TYPE "AuditLogAction" ADD VALUE 'MEMBER_REMOVED';
ALTER TYPE "AuditLogAction" ADD VALUE 'STATUS_CHANGED';
ALTER TYPE "AuditLogAction" ADD VALUE 'DEADLINE_CHANGED';
ALTER TYPE "AuditLogAction" ADD VALUE 'TASK_CREATED_VIA_TELEGRAM';
ALTER TYPE "AuditLogAction" ADD VALUE 'TASK_CREATED_VIA_WEBHOOK';

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "membershipId" TEXT;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
