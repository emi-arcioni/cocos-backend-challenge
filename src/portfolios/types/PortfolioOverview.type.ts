import { Order } from '../../orders/entities/order.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';

export type PortfolioOverview = {
  totalShares: number;
  totalCost: number;
  averagePrice: number;
  marketValue: number;
  netProfit: number;
  unrealizedPnL: number;
  totalProfit: number;
  performance: number;
  instrument: Pick<Instrument, 'ticker' | 'name'>;
  orders: Omit<Order, 'instrument' | 'user'>[];
};
