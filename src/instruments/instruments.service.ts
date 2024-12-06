import { Injectable } from '@nestjs/common';
import { InstrumentRepository } from './instrument.repository';
import { Instrument } from './entities/instrument.entity';
import { FindInstrumentsOptions } from './types/instruments';
import { PaginatedResponse } from './types/PaginatedResponse';

interface PaginationOptions {
  page: number;
  limit: number;
}

@Injectable()
export class InstrumentsService {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async findAll(
    options?: FindInstrumentsOptions,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResponse<Instrument>> {
    return this.instrumentRepository.findAll(options, pagination);
  }

  async findByTicker(ticker: string): Promise<Instrument> {
    return this.instrumentRepository.findByTicker(ticker);
  }
}
