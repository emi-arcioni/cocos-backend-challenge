import { Injectable } from '@nestjs/common';
import { MarketDataRepository } from './market-data.repository';

@Injectable()
export class MarketDataService {
  constructor(private readonly marketDataRepository: MarketDataRepository) {}

  async findAll(ticker?: string): Promise<Map<number, number>> {
    const marketValues =
      await this.marketDataRepository.getMarketValues(ticker);
    return new Map(
      marketValues.map((value) => [value.instrument.id, value.close]),
    );
  }
}
