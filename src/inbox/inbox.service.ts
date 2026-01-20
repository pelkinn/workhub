import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { TasksService } from "@/tasks/tasks.service";
import { InboxRequestDto, InboxEventType } from "./dto/inbox-request.dto";
import { CreateTaskDto } from "@/tasks/dto/create-task.dto";

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService
  ) {}

  async processEvent(request: InboxRequestDto) {
    this.logger.log(
      `Processing event: source=${request.source}, type=${request.type}`
    );

    switch (request.type) {
      case InboxEventType.TASK_CREATE:
        return this.handleTaskCreate(request);
      default:
        throw new BadRequestException(
          `Unsupported event type: ${request.type}`
        );
    }
  }

  private async handleTaskCreate(request: InboxRequestDto) {
    const { data } = request;

    // Проверяем существование проекта
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new BadRequestException(`Project with id ${data.projectId} not found`);
    }

    // Создаем DTO для задачи
    const createTaskDto: CreateTaskDto = {
      title: data.title,
      description: data.description,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };

    // Создаем задачу через TasksService
    const task = await this.tasksService.create(data.projectId, createTaskDto);

    this.logger.log(
      `Task created: id=${task.id}, projectId=${data.projectId}, source=${request.source}`
    );

    return {
      success: true,
      task,
    };
  }
}

