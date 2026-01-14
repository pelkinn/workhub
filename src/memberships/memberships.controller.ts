import { Controller, Get, Param } from "@nestjs/common";
import { MembershipsService } from "./memberships.service";
import { MembershipsResponseDto } from "./dto/memberships-response.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("memberships")
@Controller("projects/:projectId/memberships")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  @ApiOperation({ summary: "Получить всех участников проекта" })
  @ApiResponse({
    status: 200,
    description: "Участники проекта",
    type: [MembershipsResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "Проект не найден",
  })
  findAll(
    @Param("projectId") projectId: string
  ): Promise<MembershipsResponseDto[]> {
    return this.membershipsService.findAll(projectId);
  }
}
