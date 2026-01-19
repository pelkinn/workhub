import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TestProcessor } from "./processors/test.processor";
import { QueuesService } from "./queues.service";

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
  ],
  providers: [TestProcessor, QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}

