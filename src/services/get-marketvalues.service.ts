import { Injectable } from '@nestjs/common';
import { MarketDataRepository } from '../repositories/marketData.repository';

@Injectable()
export class GetMarketValuesService {
  constructor(private readonly marketDataRepository: MarketDataRepository) {}

  async execute(ticker?: string): Promise<Map<number, number>> {
    const marketValues =
      await this.marketDataRepository.getMarketValues(ticker);
    return new Map(
      marketValues.map((value) => [value.instrument.id, value.close]),
    );
  }
}
