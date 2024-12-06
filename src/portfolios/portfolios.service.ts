import { Injectable } from '@nestjs/common';
import { PortfolioRepository } from './portfolio.repository';
import { Portfolio } from './entities/portfolio.entity';
import { MarketDataService } from '../market-data/market-data.service';
import { OrderRepository } from '../orders/order.repository';
import { UsersService } from '../users/users.service';
import { OrderStatus } from '../orders/enums/OrderStatus.enum';
import { EntityManager } from 'typeorm';
import { OrderSide } from '../orders/enums/OrderSide.enum';
import { PortfolioOverview } from './types/PortfolioOverview.type';
import { Order } from '../orders/entities/order.entity';
import { InstrumentType } from '../common/enums/InstrumentType.enum';

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly marketDataService: MarketDataService,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly usersService: UsersService,
  ) {}

  async findOneByAccountNumber(accountNumber: string): Promise<Portfolio> {
    return this.portfolioRepository.findOneByAccountNumber(accountNumber);
  }

  // Updates cash balance based on order type (buy/sell/cash operations)
  private updateBalance(order: Order, orderValue: number): number {
    const isCashInflow =
      order.side === OrderSide.CASH_IN || order.side === OrderSide.SELL;
    return isCashInflow ? orderValue : -orderValue;
  }

  // Updates position metrics when a new order is processed
  private updatePosition(
    order: Order,
    currentPosition: PortfolioOverview,
  ): PortfolioOverview {
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
    position: PortfolioOverview,
    currentPrice: number,
  ): PortfolioOverview {
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

  async sync(
    accountNumber: string,
    entityManager?: EntityManager,
  ): Promise<Portfolio> {
    // Get all filled orders for the account using repository method
    const orders = entityManager
      ? await this.orderRepository.findAllByAccountNumberAndStatus(
          accountNumber,
          OrderStatus.FILLED,
          entityManager,
        )
      : await this.orderRepository.findAllByAccountNumberAndStatus(
          accountNumber,
          OrderStatus.FILLED,
        );

    // Get the map of current market prices for all instruments
    const marketDataMap = await this.marketDataService.findAll();

    // Initialize portfolio map and balance
    const portfolioOverview: Map<number, PortfolioOverview> = new Map();
    let balance = 0;

    // Process each order to build the portfolio
    orders.forEach((order) => {
      const orderValue = order.size * order.price;
      balance += this.updateBalance(order, orderValue);

      const { id: instrumentId, type } = order.instrument;

      // Get existing position or initialize new one
      const currentPosition =
        portfolioOverview.get(instrumentId) ||
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
        } as PortfolioOverview);

      // Update position with new order and current market price
      const updatedPosition = this.updatePosition(order, currentPosition);
      const currentPrice = marketDataMap.get(instrumentId) || 0;
      const finalPosition = this.calculateMarketMetrics(
        updatedPosition,
        currentPrice,
      );

      // Only store "ACCIONES" positions in the portfolio
      if (type === InstrumentType.ACCIONES) {
        portfolioOverview.set(instrumentId, {
          ...finalPosition,
          instrument: {
            ticker: order.instrument.ticker,
            name: order.instrument.name,
          },
          orders: [
            ...currentPosition.orders,
            // Ignore the linter warning since we intentionally omit instrument and user
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (({ instrument, user, ...rest }) => rest)(order),
          ],
        });
      }
    });

    const user = await this.usersService.findOne(accountNumber);

    const portfolio = new Portfolio({
      user,
      balance,
      overview: Array.from(portfolioOverview.values()),
    });

    // Use repository method for upsert
    return entityManager
      ? this.portfolioRepository.upsert(portfolio, entityManager)
      : this.portfolioRepository.upsert(portfolio);
  }
}
