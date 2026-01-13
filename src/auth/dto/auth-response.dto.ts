import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./user-response.dto";

export class AuthResponseDto {
  @ApiProperty({ description: "JWT токен доступа" })
  access_token!: string;

  @ApiProperty({ description: "Данные пользователя", type: UserResponseDto })
  user!: UserResponseDto;
}
