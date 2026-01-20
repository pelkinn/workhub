import { Module, forwardRef } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";
import { PrismaModule } from "@/prisma/prisma.module";
import { MembershipsModule } from "@/memberships/memberships.module";

@Module({
  imports: [PrismaModule, forwardRef(() => MembershipsModule)],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}

