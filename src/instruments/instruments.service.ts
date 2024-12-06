import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(InstrumentsService.name);

  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async findAll(
    options?: FindInstrumentsOptions,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResponse<Instrument>> {
    this.logger.log('Fetching all instruments');
    try {
      const result = await this.instrumentRepository.findAll(
        options,
        pagination,
      );
      this.logger.debug(`Found ${result.items.length} instruments`);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch instruments', error.stack);
      throw error;
    }
  }

  async findByTicker(ticker: string): Promise<Instrument> {
    return this.instrumentRepository.findByTicker(ticker);
  }
}
