import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class QueuesService {
  constructor(@InjectQueue("test-queue") private readonly testQueue: Queue) {}

  async addTestJob(data: any) {
    return await this.testQueue.add("test-job", data);
  }
}
