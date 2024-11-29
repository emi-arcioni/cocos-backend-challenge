import { Controller, Get, Query } from '@nestjs/common';
import { GetInstrumentsService } from '../services/get-instruments.service';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly getInstrumentsService: GetInstrumentsService) {}

  @Get()
  findAll(@Query('ticker') ticker?: string, @Query('name') name?: string) {
    return this.getInstrumentsService.execute({ ticker, name });
  }
}
