import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
    });
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  async create(projectId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: { ...createTaskDto, projectId },
    });
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
}
