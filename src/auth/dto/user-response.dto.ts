import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ description: "Идентификатор пользователя" })
  id!: string;

  @ApiProperty({ description: "Email пользователя" })
  email!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Имя пользователя",
  })
  name!: string | null;
}
