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
      .innerJoinAndSelect('marketData.instrument', 'instrument')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(md.date)')
          .from(MarketData, 'md')
          .where('md.instrumentId = marketData.instrumentId')
          .getQuery();
        return 'marketData.date = ' + subQuery;
      })
      .select(['marketData.close', 'marketData.date', 'instrument.ticker'])
      .orderBy('marketData.instrumentId', 'ASC')
      .getMany();
  }
}
