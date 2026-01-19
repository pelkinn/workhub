import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { QueuesService } from './queues/queues.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly queuesService: QueuesService,
  ) {}

  @Get('health')
  @ApiOkResponse({ description: 'Сервис работает нормально.' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('test-queue')
  @ApiOkResponse({ description: 'Job добавлен в очередь.' })
  async addTestJob(@Body() data: any) {
    const job = await this.queuesService.addTestJob(data);
    return {
      message: 'Job добавлен в очередь',
      jobId: job.id,
      data: job.data,
    };
  }
}
