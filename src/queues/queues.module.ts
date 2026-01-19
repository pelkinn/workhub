import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TestProcessor } from "./processors/test.processor";
import { ReminderProcessor } from "./processors/reminder.processor";
import { QueuesService } from "./queues.service";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
      },
    }),
    BullModule.registerQueue({
      name: "test-queue",
    }),
    BullModule.registerQueue({
      name: "reminders-queue",
    }),
    PrismaModule,
  ],
  providers: [TestProcessor, ReminderProcessor, QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
