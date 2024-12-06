import { Controller, Get, Logger, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('instruments')
export class InstrumentsController {
  private readonly logger = new Logger(InstrumentsController.name);

  constructor(private readonly instrumentsService: InstrumentsService) {}
  @Get()
  async findAll(
    @Query('ticker') ticker?: string,
    @Query('name') name?: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    this.logger.log('Fetching all instruments');
    try {
      const page = paginationQuery?.page || 1;
      const limit = paginationQuery?.limit || 10;
      const result = await this.instrumentsService.findAll(
        { ticker, name },
        { page, limit },
      );
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch instruments', error.stack);
      throw error;
    }
  }
}
