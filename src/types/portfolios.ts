import { Order } from '../entities/order.entity';
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
  instrument: Pick<Instrument, 'ticker' | 'name'>;
  orders: Omit<Order, 'instrument'>[];
};
