import { Controller, Get, Logger } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  private readonly logger = new Logger(InstrumentsController.name);

  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  async findAll() {
    this.logger.log('Fetching all instruments');
    try {
      const result = await this.instrumentsService.findAll();
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch instruments', error.stack);
      throw error;
    }
  }
}
