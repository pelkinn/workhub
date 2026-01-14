import { ApiProperty } from "@nestjs/swagger";
import { MembershipRole } from "@prisma/client";

export class MembershipsResponseDto {
  @ApiProperty({ description: "ID участника в проекте", example: "1" })
  id!: string;

  @ApiProperty({ description: "ID пользователя в проекте", example: "1" })
  userId!: string;

  @ApiProperty({
    description: "Имя участника в проекте",
    example: "Иван Иванов",
  })
  name!: string;

  @ApiProperty({ description: "Роль участника в проекте", example: "owner" })
  role!: MembershipRole;

  @ApiProperty({
    description: "Дата добавления участника в проект",
    example: "2026-01-14T06:37:32.031Z",
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Дата обновления роли участника в проекте",
    example: "2026-01-14T06:37:32.031Z",
  })
  updatedAt!: Date;
}
