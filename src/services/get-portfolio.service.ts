import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { MarketDataRepository } from '../repositories/marketData.repository';
import { Portfolio } from '../types/portfolio';

@Injectable()
export class GetPortfolioService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly marketDataRepository: MarketDataRepository,
  ) {}

  async execute(accountNumber: string) {
    const orders = await this.orderRepository.findAllByAccountNumberAndStatus(
      accountNumber,
      'FILLED',
    );

    const marketValues = await this.marketDataRepository.getMarketValues();
    const marketDataMap = new Map(
      marketValues.map((value) => [value.instrumentId, value.close]),
    );

    const portfolio: Map<number, Portfolio> = new Map();
    let balance = 0;

    orders.forEach((order) => {
      // Calculate order value and update balance
      const orderValue = order.size * order.price;
      const isCashInflow = order.side === 'CASH_IN' || order.side === 'SELL';
      balance += isCashInflow ? orderValue : -orderValue;

      // Get or initialize portfolio calculations for this instrument
      const { id: instrumentId, type } = order.instrument;
      let {
        totalShares,
        totalCost,
        averagePrice,
        marketValue,
        netProfit,
        unrealizedPnL,
        totalProfit,
        performance,
      } = portfolio.get(instrumentId) || {
        totalShares: 0,
        totalCost: 0,
        averagePrice: 0,
        marketValue: 0,
        netProfit: 0,
        unrealizedPnL: 0,
        totalProfit: 0,
        performance: 0,
      };

      // Update position based on order type
      if (order.side === 'BUY') {
        // Update average price and total shares for buy order
        const newTotalCost = averagePrice * totalShares + orderValue;
        totalShares += order.size;
        averagePrice = newTotalCost / totalShares;
      } else if (order.side === 'SELL') {
        // Calculate and update realized profit for sell order
        const profitPerShare = order.price - averagePrice;
        netProfit += profitPerShare * order.size;
        totalShares -= order.size;
      }

      // Update market-dependent calculations
      const currentPrice = marketDataMap.get(instrumentId) || 0;
      marketValue = totalShares * currentPrice;
      totalCost = totalShares * averagePrice;
      unrealizedPnL = marketValue - totalCost;
      totalProfit = netProfit + unrealizedPnL;
      performance =
        totalCost !== 0
          ? parseFloat(((totalProfit / totalCost) * 100).toFixed(2))
          : 0;

      if (type === 'ACCIONES')
        portfolio.set(instrumentId, {
          totalShares,
          totalCost,
          averagePrice,
          marketValue,
          netProfit,
          unrealizedPnL,
          totalProfit,
          performance,
          instrument: {
            ticker: order.instrument.ticker,
            name: order.instrument.name,
          },
        });
    });

    return { balance, portfolio: Array.from(portfolio.values()) };
  }
}
