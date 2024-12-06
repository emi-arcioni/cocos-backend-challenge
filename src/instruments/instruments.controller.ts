import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  findAll(
    @Query('ticker') ticker?: string,
    @Query('name') name?: string,
    @Query() paginationQuery?: PaginationQueryDto,
  ) {
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 10;
    return this.instrumentsService.findAll({ ticker, name }, { page, limit });
  }
}
