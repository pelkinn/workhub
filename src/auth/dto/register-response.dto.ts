import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponseDto {
  @ApiProperty({ description: "Успешно ли зарегистрирован пользователь" })
  success!: boolean;
}
