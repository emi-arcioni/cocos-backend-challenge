import { Instrument } from '../entities/instrument.entity';

export type Portfolio = {
  totalShares: number;
  totalCost: number;
  averagePrice: number;
  marketValue: number;
  netProfit: number;
  unrealizedPnL: number;
  totalProfit: number;
  performance: number;
  instrument: Partial<Instrument>;
};
