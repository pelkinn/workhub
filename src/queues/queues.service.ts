import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class QueuesService implements OnModuleInit {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectQueue("test-queue") private readonly testQueue: Queue,
    @InjectQueue("reminders-queue") private readonly remindersQueue: Queue
  ) {}

  async onModuleInit() {
    // Настраиваем периодический запуск reminder job
    // Запускается каждый час (можно изменить на нужный интервал)
    const cronPattern = process.env.REMINDER_CRON || "0 * * * *"; // Каждый час в 0 минут
    const jobName = "reminder-job";

    // Удаляем существующую повторяющуюся задачу, если она есть
    // Используем removeRepeatable вместо deprecated getRepeatableJobs
    try {
      await this.remindersQueue.removeRepeatable(jobName, {
        pattern: cronPattern,
      });
      this.logger.log(`Removed existing repeatable reminder job`);
    } catch (error) {
      // Игнорируем ошибку, если задачи не существует
    }

    // Добавляем новую повторяющуюся задачу
    await this.remindersQueue.add(
      jobName,
      { reminderHours: parseInt(process.env.REMINDER_HOURS || "24", 10) },
      {
        repeat: {
          pattern: cronPattern,
        },
        jobId: "reminder-job-recurring", // Фиксированный ID для повторяющейся задачи
      }
    );
    this.logger.log(`Scheduled reminder job with cron pattern: ${cronPattern}`);
  }

  async addTestJob(data: any) {
    return await this.testQueue.add("test-job", data);
  }

  async addReminderJob(data: { reminderHours?: number }) {
    return await this.remindersQueue.add("reminder-job", data);
  }
}
