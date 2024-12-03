import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../entities/dto/create-order.dto';
import { GetInstrumentService } from './get-instrument.service';
import { GetUserService } from './get-user.service';
import { OrderSide, OrderStatus, OrderType } from '../types/orders';
import { GetPortfolioService } from './get-portfolio.service';
import { Currency } from '../types/instruments';
import { GetMarketValuesService } from './get-marketvalues.service';

@Injectable()
export class SetOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly getInstrumentService: GetInstrumentService,
    private readonly getUserService: GetUserService,
    private readonly getPortfolioService: GetPortfolioService,
    private readonly getMarketValuesService: GetMarketValuesService,
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<Order> {
    // TODO: implement locking mechanism

    const { accountNumber, size, side } = createOrderDto;
    let { type, price, ticker } = createOrderDto;
    let status: OrderStatus = OrderStatus.FILLED;

    ticker =
      side === OrderSide.CASH_IN || side === OrderSide.CASH_OUT
        ? Currency.ARS
        : ticker;

    const [instrument, user, portfolio] = await Promise.all([
      this.getInstrumentService.execute(ticker),
      this.getUserService.execute(accountNumber),
      this.getPortfolioService.execute(accountNumber),
    ]);

    const instrumentBalance = portfolio.assets.find(
      (position) => position.instrument.ticker === ticker,
    );

    // For cash operations (CASH_IN/CASH_OUT):
    // - Price is set to 1 since it's just a cash transfer
    // - Type is always MARKET since it executes immediately
    if ([OrderSide.CASH_IN, OrderSide.CASH_OUT].includes(side)) {
      price = 1;
      type = OrderType.MARKET;
    }

    // For limit orders, the order is created with NEW status since it will be executed
    // when the market price matches the user's specified limit price (Not implemented)
    if (type === OrderType.LIMIT) {
      status = OrderStatus.NEW;
    }

    // For market (buy/sell) orders, use the latest closing price from market data
    if (
      type === OrderType.MARKET &&
      [OrderSide.BUY, OrderSide.SELL].includes(side)
    ) {
      const marketValue = await this.getMarketValuesService.execute(ticker);
      price = marketValue.get(instrument.id);

      // TODO: Allow user to send either exact number of shares or total investment amount
      // in pesos (in this case, calculate maximum number of shares that can be sent,
      // fractional shares are not allowed).
    }

    // For BUY orders, validate if user has sufficient balance to cover the total cost (price * size)
    const buyWithEnoughBalance =
      side === OrderSide.BUY && portfolio.balance >= price * size;

    // For SELL orders, validate if user has sufficient shares in their portfolio to execute the sell order
    const sellWithEnoughShares =
      side === OrderSide.SELL && instrumentBalance.totalShares >= size;

    // For CASH_OUT orders, verify that the user's portfolio has sufficient balance to withdraw the requested amount
    const cashOutWithEnoughBalance =
      side === OrderSide.CASH_OUT && portfolio.balance >= size;

    if (
      !buyWithEnoughBalance ||
      !sellWithEnoughShares ||
      !cashOutWithEnoughBalance
    ) {
      status = OrderStatus.REJECTED;
    }

    const order = new Order({
      instrument,
      user,
      type,
      price,
      size,
      side,
      status,
    });

    return this.orderRepository.save(order);
  }
}
