import { ApiProperty } from "@nestjs/swagger";

export class TasksResponseDto {
  @ApiProperty({ description: "ID задачи", example: "1" })
  id!: string;

  @ApiProperty({ description: "Заголовок задачи", example: "Заголовок задачи" })
  title!: string;

  @ApiProperty({ description: "Описание задачи", example: "Описание задачи" })
  description!: string | null;

  @ApiProperty({ description: "Выполнена ли задача", example: true })
  completed!: boolean;

  @ApiProperty({
    description: "Дедлайн задачи",
    example: "2026-01-14T06:37:32.031Z",
  })
  deadline!: Date | null;

  @ApiProperty({
    description: "Дата создания задачи",
    example: "2026-01-14T06:37:32.031Z",
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Дата обновления задачи",
    example: "2026-01-14T06:37:32.031Z",
  })
  updatedAt!: Date;
}
