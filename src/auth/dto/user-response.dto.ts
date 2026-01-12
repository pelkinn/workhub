import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "Идентификатор пользователя" })
  id!: string;

  @ApiProperty({ description: "Email пользователя" })
  email!: string;

  @ApiProperty({ nullable: true, description: "Имя пользователя" })
  name!: string | null;

  @ApiProperty({ description: "Дата создания пользователя" })
  createdAt!: Date;

  @ApiProperty({ description: "Дата последнего обновления пользователя" })
  updatedAt!: Date;
}
