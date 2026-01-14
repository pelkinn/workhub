import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TasksService } from "./tasks.service";
import { TasksResponseDto } from "./dto/tasks-response.dto";
import { CreateTaskDto } from "./dto/create-task.dto";

@ApiTags("tasks")
@Controller("projects/:projectId/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: "Получить все задачи проекта" })
  @ApiResponse({
    status: 200,
    description: "Задачи проекта",
    type: [TasksResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "Проект не найден",
  })
  findAll(@Param("projectId") projectId: string): Promise<TasksResponseDto[]> {
    return this.tasksService.findAll(projectId);
  }

  @Post()
  @ApiOperation({ summary: "Создать задачу в проекте" })
  @ApiResponse({
    status: 201,
    description: "Задача создана",
    type: TasksResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Проект не найден",
  })
  create(
    @Param("projectId") projectId: string,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<TasksResponseDto> {
    return this.tasksService.create(projectId, createTaskDto);
  }
}
