import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity';
import { FindInstrumentsOptions } from '../types/instruments';
import { FindOperator, ILike, Repository } from 'typeorm';

@Injectable()
export class InstrumentRepository {
  constructor(
    @InjectRepository(Instrument)
    private instruments: Repository<Instrument>,
  ) {}

  findAll(options?: FindInstrumentsOptions): Promise<Instrument[]> {
    const where: {
      ticker?: FindOperator<string>;
      name?: FindOperator<string>;
    } = {};
    if (options?.ticker) where.ticker = ILike(`%${options.ticker}%`);
    if (options?.name) where.name = ILike(`%${options.name}%`);

    return this.instruments.find({ where });
  }
}
