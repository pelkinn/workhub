import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ description: "JWT токен доступа" })
  access_token!: string;

  @ApiProperty({ description: "Информация о пользователе" })
  user!: {
    id: string;
    email: string;
    name: string | null;
  };
}
