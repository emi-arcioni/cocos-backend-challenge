import { Injectable } from '@nestjs/common';
import { InstrumentRepository } from './instrument.repository';
import { Instrument } from './entities/instrument.entity';
import { FindInstrumentsOptions } from './types/instruments';

@Injectable()
export class InstrumentsService {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async findAll(options?: FindInstrumentsOptions): Promise<Instrument[]> {
    return this.instrumentRepository.findAll(options);
  }

  async findByTicker(ticker: string): Promise<Instrument> {
    return this.instrumentRepository.findByTicker(ticker);
  }
}
