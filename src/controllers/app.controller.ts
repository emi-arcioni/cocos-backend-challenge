import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiWorks(): { message: string } {
    return { message: this.appService.getApiWorks() };
  }
}
