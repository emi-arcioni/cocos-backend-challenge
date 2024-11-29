import { Injectable } from '@nestjs/common';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentRepository } from '../repositories/instrument.repository';
import { FindInstrumentsOptions } from '../types/instruments';

@Injectable()
export class GetInstrumentsService {
  constructor(private readonly instrumentRepository: InstrumentRepository) {}

  async execute(options?: FindInstrumentsOptions): Promise<Instrument[]> {
    return this.instrumentRepository.findAll(options);
  }
}
