import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { InboxService } from "./inbox.service";
import { InboxRequestDto } from "./dto/inbox-request.dto";

@ApiTags("inbox")
@Controller("inbox")
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Единая точка входа для входящих событий" })
  @ApiResponse({
    status: 200,
    description: "Событие успешно обработано",
  })
  @ApiResponse({
    status: 400,
    description: "Неверный формат запроса или данные",
  })
  async processEvent(@Body() request: InboxRequestDto) {
    return this.inboxService.processEvent(request);
  }
}

