import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class QueuesService implements OnModuleInit {
  private readonly logger = new Logger(QueuesService.name);

  constructor(
    @InjectQueue("test-queue") private readonly testQueue: Queue,
    @InjectQueue("reminders-queue") private readonly remindersQueue: Queue,
    @InjectQueue("deadline-reminders-queue")
    private readonly deadlineRemindersQueue: Queue,
    @InjectQueue("daily-digest-queue")
    private readonly dailyDigestQueue: Queue
  ) {}

  async onModuleInit() {
    // Настраиваем периодический запуск reminder job
    // Запускается каждый час (можно изменить на нужный интервал)
    const cronPattern = process.env.REMINDER_CRON || "0 * * * *"; // Каждый час в 0 минут
    const jobName = "reminder-job";

    // Удаляем все существующие repeatable jobs для reminder
    // Это важно, чтобы избежать дублирования при изменении паттерна
    try {
      const repeatableJobs = await this.remindersQueue.getRepeatableJobs();
      for (const job of repeatableJobs) {
        if (job.name === jobName) {
          await this.remindersQueue.removeRepeatableByKey(job.key);
          this.logger.log(
            `Removed existing repeatable reminder job with key: ${job.key}`
          );
        }
      }
    } catch (error) {
      // Игнорируем ошибку, если задач не существует
      this.logger.debug(`No existing repeatable reminder jobs to remove`);
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

    // Настраиваем ежедневный дайджест (09:00 каждый день)
    const dailyDigestCronPattern = process.env.DAILY_DIGEST_CRON || "0 9 * * *";
    const dailyDigestJobName = "daily-digest-job";

    // Удаляем все существующие repeatable jobs для daily digest
    // Это важно, чтобы избежать дублирования при изменении паттерна
    try {
      const repeatableJobs = await this.dailyDigestQueue.getRepeatableJobs();
      for (const job of repeatableJobs) {
        if (job.name === dailyDigestJobName) {
          await this.dailyDigestQueue.removeRepeatableByKey(job.key);
          this.logger.log(
            `Removed existing repeatable daily digest job with key: ${job.key}`
          );
        }
      }
    } catch (error) {
      // Игнорируем ошибку, если задач не существует
      this.logger.debug(`No existing repeatable daily digest jobs to remove`);
    }

    await this.dailyDigestQueue.add(
      dailyDigestJobName,
      {},
      {
        repeat: {
          pattern: dailyDigestCronPattern,
        },
        jobId: "daily-digest-job-recurring",
      }
    );
    this.logger.log(
      `Scheduled daily digest job with cron pattern: ${dailyDigestCronPattern}`
    );
  }

  async addTestJob(data: any) {
    return await this.testQueue.add("test-job", data);
  }

  async addReminderJob(data: { reminderHours?: number }) {
    return await this.remindersQueue.add("reminder-job", data);
  }

  async scheduleDeadlineReminder(
    taskId: string,
    taskTitle: string,
    projectName: string,
    deadline: Date
  ): Promise<void> {
    const now = new Date();
    const reminderTime = new Date(deadline.getTime() - 60 * 60 * 1000); // За 1 час до дедлайна
    const delay = reminderTime.getTime() - now.getTime();

    // Если время уже прошло, не планируем задачу
    if (delay <= 0) {
      this.logger.warn(
        `Cannot schedule reminder for task ${taskId}: reminder time has already passed`
      );
      return;
    }

    const jobId = `deadline-reminder-${taskId}`;

    // Удаляем существующую задачу, если она есть (на случай обновления дедлайна)
    try {
      const existingJob = await this.deadlineRemindersQueue.getJob(jobId);
      if (existingJob) {
        await existingJob.remove();
        this.logger.log(`Removed existing reminder job for task ${taskId}`);
      }
    } catch (error) {
      // Игнорируем ошибку, если задачи не существует
    }

    await this.deadlineRemindersQueue.add(
      "deadline-reminder",
      {
        taskId,
        taskTitle,
        projectName,
        deadline: deadline.toISOString(),
      },
      {
        delay,
        jobId,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    this.logger.log(
      `Scheduled deadline reminder for task ${taskId} (${taskTitle}) in ${Math.round(
        delay / 1000 / 60
      )} minutes`
    );
  }

  async cancelDeadlineReminder(taskId: string): Promise<void> {
    const jobId = `deadline-reminder-${taskId}`;

    try {
      const existingJob = await this.deadlineRemindersQueue.getJob(jobId);
      if (existingJob) {
        await existingJob.remove();
        this.logger.log(`Cancelled reminder job for task ${taskId}`);
      }
    } catch (error) {
      // Игнорируем ошибку, если задачи не существует
      this.logger.debug(`No reminder job found for task ${taskId}`);
    }
  }
}
