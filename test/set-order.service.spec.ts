import { Test, TestingModule } from '@nestjs/testing';
import { SetOrderService } from '../src/services/set-order.service';
import { MarketDataRepository } from '../src/market-data/market-data.repository';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { OrderSide, OrderStatus, OrderType } from '../src/orders/types/orders';
import { OrderRepository } from '../src/orders/order.repository';
import { GetInstrumentService } from '../src/services/get-instrument.service';
import { GetUserService } from '../src/services/get-user.service';
import { GetMarketValuesService } from '../src/services/get-marketvalues.service';
import { InstrumentRepository } from '../src/instruments/instrument.repository';
import { UserRepository } from '../src/users/user.repository';
import { InstrumentType } from '../src/instruments/types/instruments';
import { DataSource } from 'typeorm';
import { Order } from '../src/orders/entities/order.entity';

describe('SetOrderService', () => {
  let service: SetOrderService;
  let orders: Order[] = [];

  beforeEach(async () => {
    orders = []; // Reset orders array before each test
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderRepository,
          useValue: {
            findAllByAccountNumberAndStatus: jest
              .fn()
              .mockImplementation(() => Promise.resolve(orders)),
            save: jest.fn().mockImplementation((order) => {
              orders.push(order);
              return Promise.resolve(order);
            }),
          },
        },
        {
          provide: InstrumentRepository,
          useValue: {
            findByTicker: jest.fn().mockImplementation((ticker) => {
              const instruments = {
                ARS: {
                  id: 66,
                  ticker: 'ARS',
                  type: InstrumentType.MONEDA,
                  name: 'Pesos',
                },
                HAVA: {
                  id: 64,
                  ticker: 'HAVA',
                  type: InstrumentType.ACCIONES,
                  name: 'Havanna Holding',
                },
              };
              return Promise.resolve(instruments[ticker]);
            }),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              accountNumber: '1234567890',
              email: 'test@test.com',
            }),
          },
        },
        {
          provide: MarketDataRepository,
          useValue: {
            getMarketValues: jest.fn().mockResolvedValue([
              {
                close: 100.5,
                date: new Date('2024-04-20'),
                instrument: { id: 64 },
              },
            ]),
          },
        },
        SetOrderService,
        GetInstrumentService,
        GetUserService,
        GetMarketValuesService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn().mockImplementation((order) => {
                  if (order.side === OrderSide.CASH_OUT) {
                    // Simulate concurrent access to balance
                    const currentBalance = orders.reduce((acc, o) => {
                      if (o.side === OrderSide.CASH_IN) return acc + o.size;
                      if (o.side === OrderSide.CASH_OUT) return acc - o.size;
                      return acc;
                    }, 0);

                    if (currentBalance < order.size) {
                      throw new Error('Insufficient balance');
                    }
                  }
                  orders.push(order);
                  return Promise.resolve(order);
                }),
                createQueryBuilder: jest.fn().mockReturnValue({
                  setLock: jest.fn().mockReturnThis(),
                  innerJoinAndSelect: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getMany: jest.fn().mockResolvedValue([]),
                }),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SetOrderService>(SetOrderService);
  });

  it('should prevent concurrent CASH_OUT operations exceeding available balance', async () => {
    const cashOutAmount = 400; // Will try to withdraw 400 x 3 = 1200 (more than available)
    const cashInAmount = 1000; // Initial balance
    const concurrentCashOuts = 3;

    // Initial CASH_IN operation
    const cashInOrder: Partial<CreateOrderDto> = {
      accountNumber: '1234567890',
      size: cashInAmount,
      side: OrderSide.CASH_IN,
    };

    await service.execute(cashInOrder as CreateOrderDto);

    const cashOutOrder: Partial<CreateOrderDto> = {
      accountNumber: '1234567890',
      size: cashOutAmount,
      side: OrderSide.CASH_OUT,
    };

    // Create array of promises for concurrent CASH_OUT operations
    const cashOutPromises = Array(concurrentCashOuts)
      .fill(null)
      .map(() => service.execute(cashOutOrder as CreateOrderDto));

    // Execute all CASH_OUT operations concurrently
    const results = await Promise.allSettled(cashOutPromises);

    // Count successful and failed operations
    const successful = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;
    const failed = results.filter(
      (result) => result.status === 'rejected',
    ).length;

    // We expect only 2 operations to succeed (800 total) and 1 to fail
    expect(successful).toBe(2);
    expect(failed).toBe(1);

    // Verify final balance
    const finalBalance = orders.reduce((acc, order) => {
      if (order.side === OrderSide.CASH_IN) return acc + order.size;
      if (order.side === OrderSide.CASH_OUT) return acc - order.size;
      return acc;
    }, 0);

    expect(finalBalance).toBe(200); // 1000 - (400 * 2) = 200
  });

  // Additional tests for order creation
  describe('execute', () => {
    it('should successfully execute a buy order', async () => {
      // add a chash to increase the balance
      await service.execute({
        accountNumber: '1234567890',
        size: 100000,
        side: OrderSide.CASH_IN,
      } as CreateOrderDto);

      const orderDto: Partial<CreateOrderDto> = {
        accountNumber: '1234567890',
        size: 10,
        side: OrderSide.BUY,
        type: OrderType.MARKET,
        ticker: 'HAVA',
      };

      const result = await service.execute(orderDto as CreateOrderDto);

      expect(result).toBeDefined();
      expect(result.side).toBe(OrderSide.BUY);
      expect(result.size).toBe(10);
      expect(result.price).toBe(100.5);
    });

    it('should throw an error for invalid order execution', async () => {
      const invalidOrderDto: Partial<CreateOrderDto> = {
        accountNumber: '1234567890',
        size: 1000,
        side: OrderSide.BUY,
        type: OrderType.MARKET,
        ticker: 'HAVA',
      };

      const result = await service.execute(invalidOrderDto as CreateOrderDto);
      expect(result.status).toBe(OrderStatus.REJECTED);
    });
  });
});
