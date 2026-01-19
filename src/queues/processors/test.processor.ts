import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";

@Processor("test-queue")
export class TestProcessor extends WorkerHost {
  private readonly logger = new Logger(TestProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} with data:`, job.data);
    
    // Простая обработка - логируем данные
    const result = {
      processed: true,
      jobId: job.id,
      data: job.data,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Job ${job.id} completed successfully`);
    return result;
  }
}

