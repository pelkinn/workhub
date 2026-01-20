import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { QueuesService } from "@/queues/queues.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksResponseDto } from "./dto/tasks-response.dto";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queuesService: QueuesService
  ) {}

  private toResponseDto(task: {
    id: string;
    title: string;
    description: string | null;
    deadline: Date | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): TasksResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async findAll(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
    return tasks.map((task) => this.toResponseDto(task));
  }

  async create(projectId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: { ...createTaskDto, projectId },
      include: {
        project: true,
      },
    });

    // Если задан deadline, планируем напоминание
    if (task.deadline) {
      await this.queuesService.scheduleDeadlineReminder(
        task.id,
        task.title,
        task.project.name,
        task.deadline
      );
    }

    return this.toResponseDto(task);
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto) {
    // Получаем текущую задачу для проверки изменения deadline
    const currentTask = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!currentTask) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
      include: {
        project: true,
      },
    });

    // Если deadline изменился, перепланируем напоминание
    const deadlineChanged =
      updateTaskDto.deadline !== undefined &&
      updateTaskDto.deadline?.getTime() !== currentTask.deadline?.getTime();

    if (deadlineChanged) {
      if (task.deadline) {
        // Если новый deadline установлен, планируем напоминание
        await this.queuesService.scheduleDeadlineReminder(
          task.id,
          task.title,
          task.project.name,
          task.deadline
        );
      } else {
        // Если deadline удален, отменяем существующее напоминание
        await this.queuesService.cancelDeadlineReminder(task.id);
      }
    }

    return this.toResponseDto(task);
  }

  async delete(taskId: string) {
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
