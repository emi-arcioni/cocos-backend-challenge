import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { Portfolio } from '../types/portfolios';
import { OrderSide, OrderStatus } from '../types/orders';
import { InstrumentType } from '../types/instruments';
import { Order } from '../entities/order.entity';
import { GetMarketValuesService } from './get-marketvalues.service';

@Injectable()
export class GetPortfolioService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly getMarketValuesService: GetMarketValuesService,
  ) {}

  // Updates cash balance based on order type (buy/sell/cash operations)
  private updateBalance(order: Order, orderValue: number): number {
    const isCashInflow =
      order.side === OrderSide.CASH_IN || order.side === OrderSide.SELL;
    return isCashInflow ? orderValue : -orderValue;
  }

  // Updates position metrics when a new order is processed
  private updatePosition(order: Order, currentPosition: Portfolio): Portfolio {
    const { size, price, side } = order;
    let { totalShares, averagePrice, netProfit } = currentPosition;

    if (side === OrderSide.BUY) {
      // For buy orders: update average price and increase total shares
      const newTotalCost = averagePrice * totalShares + size * Number(price);
      totalShares += size;
      averagePrice = newTotalCost / totalShares;
    } else if (side === OrderSide.SELL) {
      // For sell orders: calculate realized profit and decrease total shares
      const profitPerShare = Number(price) - averagePrice;
      netProfit += profitPerShare * size;
      totalShares -= size;
    }

    return { ...currentPosition, totalShares, averagePrice, netProfit };
  }

  // Calculates market-dependent metrics using current price
  private calculateMarketMetrics(
    position: Portfolio,
    currentPrice: number,
  ): Portfolio {
    const { totalShares, averagePrice, netProfit } = position;

    // Calculate current market value and unrealized profits
    const marketValue = totalShares * currentPrice;
    const totalCost = totalShares * averagePrice;
    const unrealizedPnL = marketValue - totalCost;
    const totalProfit = netProfit + unrealizedPnL;

    // Calculate performance as percentage return on investment
    const performance =
      totalCost !== 0
        ? parseFloat(((totalProfit / totalCost) * 100).toFixed(2))
        : 0;

    return {
      ...position,
      marketValue,
      totalCost,
      unrealizedPnL,
      totalProfit,
      performance,
    };
  }

  async execute(
    accountNumber: string,
  ): Promise<{ balance: number; assets: Portfolio[] }> {
    // Get all filled orders for the account
    const orders = await this.orderRepository.findAllByAccountNumberAndStatus(
      accountNumber,
      OrderStatus.FILLED,
    );

    // Get the map of current market prices for all instruments
    const marketDataMap = await this.getMarketValuesService.execute();

    // Initialize portfolio map and balance
    const portfolio: Map<number, Portfolio> = new Map();
    let balance = 0;

    // Process each order to build the portfolio
    orders.forEach((order) => {
      const orderValue = order.size * order.price;
      balance += this.updateBalance(order, orderValue);

      const { id: instrumentId, type } = order.instrument;

      // Get existing position or initialize new one
      const currentPosition =
        portfolio.get(instrumentId) ||
        ({
          totalShares: 0,
          totalCost: 0,
          averagePrice: 0,
          marketValue: 0,
          netProfit: 0,
          unrealizedPnL: 0,
          totalProfit: 0,
          performance: 0,
          orders: [],
        } as Portfolio);

      // Update position with new order and current market price
      const updatedPosition = this.updatePosition(order, currentPosition);
      const currentPrice = marketDataMap.get(instrumentId) || 0;
      const finalPosition = this.calculateMarketMetrics(
        updatedPosition,
        currentPrice,
      );

      // Only store "ACCIONES" positions in the portfolio
      if (type === InstrumentType.ACCIONES) {
        portfolio.set(instrumentId, {
          ...finalPosition,
          instrument: {
            ticker: order.instrument.ticker,
            name: order.instrument.name,
          },
          orders: [
            ...currentPosition.orders,
            // Ignore the linter warning since we intentionally omit instrument
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (({ instrument, ...rest }) => rest)(order),
          ],
        });
      }
    });

    // Return both cash balance and portfolio positions
    return { balance, assets: Array.from(portfolio.values()) };
  }
}
