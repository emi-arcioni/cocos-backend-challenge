import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketData } from 'src/entities/marketData.entity';
import { InstrumentType } from 'src/types/instruments';

@Injectable()
export class MarketDataRepository {
  constructor(
    @InjectRepository(MarketData)
    private marketData: Repository<MarketData>,
  ) {}

  async getMarketValues(ticker?: string): Promise<MarketData[]> {
    return this.marketData
      .createQueryBuilder('marketData')
      .leftJoinAndSelect('marketData.instrument', 'instrument')
      .select(['marketData.close', 'marketData.date', 'instrument.id'])
      .where(
        (qb) =>
          `marketData.date = ${qb
            .subQuery()
            .select('MAX(md.date)')
            .from(MarketData, 'md')
            .getQuery()}`,
      )
      .andWhere(ticker ? 'instrument.ticker = :ticker' : '1=1', { ticker })
      .andWhere('instrument.type = :type', { type: InstrumentType.ACCIONES })
      .orderBy('marketData.instrumentId', 'ASC')
      .getMany();
  }
}
