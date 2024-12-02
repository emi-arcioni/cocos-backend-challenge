import { Injectable } from '@nestjs/common';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentRepository } from '../repositories/instrument.repository';

@Injectable()
export class GetInstrumentService {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(ticker: string): Promise<Instrument> {
    return this.instrumentRepository.findByTicker(ticker);
  }
}
