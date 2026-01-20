import { Module } from "@nestjs/common";
import { ProjectController } from "./projects.controller";
import { ProjectService } from "./projects.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
