import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  findAll(@Query('ticker') ticker?: string, @Query('name') name?: string) {
    return this.instrumentsService.findAll({ ticker, name });
  }
}
