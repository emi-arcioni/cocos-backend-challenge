import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketData } from 'src/entities/marketData.entity';

@Injectable()
export class MarketDataRepository {
  constructor(
    @InjectRepository(MarketData)
    private marketData: Repository<MarketData>,
  ) {}

  async getMarketValues(): Promise<MarketData[]> {
    return this.marketData
      .createQueryBuilder('marketData')
      .select([
        'marketData.close',
        'marketData.date',
        'marketData.instrumentId',
      ])
      .where(
        (qb) =>
          `marketData.date = ${qb
            .subQuery()
            .select('MAX(md.date)')
            .from(MarketData, 'md')
            .getQuery()}`,
      )
      .orderBy('marketData.instrumentId', 'ASC')
      .getMany();
  }
}
