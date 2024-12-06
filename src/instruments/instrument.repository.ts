import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { FindInstrumentsOptions } from './types/instruments';
import { FindOperator, ILike, Repository } from 'typeorm';
import { PaginationMeta } from './types/paginationMeta';
import { PaginatedResponse } from './types/PaginatedResponse';

interface PaginationOptions {
  page: number;
  limit: number;
}

@Injectable()
export class InstrumentRepository {
  constructor(
    @InjectRepository(Instrument)
    private instruments: Repository<Instrument>,
  ) {}

  async findAll(
    options?: FindInstrumentsOptions,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResponse<Instrument>> {
    const where: {
      ticker?: FindOperator<string>;
      name?: FindOperator<string>;
    } = {};
    if (options?.ticker) where.ticker = ILike(`%${options.ticker}%`);
    if (options?.name) where.name = ILike(`%${options.name}%`);

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.instruments.findAndCount({
      where,
      skip,
      take: limit,
    });

    const meta: PaginationMeta = {
      itemCount: items.length,
      totalItems,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return { items, meta };
  }

  findByTicker(ticker: string): Promise<Instrument> {
    return this.instruments.findOne({ where: { ticker } });
  }
}
