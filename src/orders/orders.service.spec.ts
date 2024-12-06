import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { MarketDataRepository } from '../market-data/market-data.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSide } from './enums/OrderSide.enum';
import { OrderStatus } from './enums/OrderStatus.enum';
import { OrderType } from './enums/OrderType.enum';
import { OrderRepository } from './order.repository';
import { MarketDataService } from '../market-data/market-data.service';
import { UserRepository } from '../users/user.repository';
import { InstrumentType } from '../common/enums/InstrumentType.enum';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { InstrumentsService } from '../instruments/instruments.service';
import { UsersService } from '../users/users.service';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { PortfolioRepository } from '../portfolios/portfolio.repository';

describe('OrdersService', () => {
  let service: OrdersService;
  let orders: Order[] = [];

  beforeEach(async () => {
    orders = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        InstrumentsService,
        UsersService,
        PortfoliosService,
        MarketDataService,
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
                save: jest.fn(),
                createQueryBuilder: jest.fn().mockReturnValue({
                  setLock: jest.fn().mockReturnThis(),
                  innerJoinAndSelect: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getMany: jest.fn().mockResolvedValue([]),
                  getOne: jest.fn(),
                }),
                getRepository: jest.fn().mockReturnValue({
                  findOne: jest.fn(),
                  save: jest.fn(),
                }),
              },
            }),
          },
        },
        {
          provide: OrderRepository,
          useValue: {
            findAllByAccountNumberAndStatus: jest
              .fn()
              .mockResolvedValue(orders),
            save: jest.fn().mockImplementation((order) => {
              orders.push(order);
              return order;
            }),
          },
        },
        {
          provide: InstrumentsService,
          useValue: {
            findByTicker: jest.fn().mockImplementation((ticker) => {
              if (ticker === 'HAVA') {
                return Promise.resolve({
                  id: 1,
                  ticker: 'HAVA',
                  type: InstrumentType.ACCIONES,
                });
              } else if (ticker === 'ARS') {
                return Promise.resolve({
                  id: 2,
                  ticker: 'ARS',
                  type: InstrumentType.MONEDA,
                });
              }
              return Promise.resolve(null);
            }),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PortfolioRepository,
          useValue: {
            upsert: jest.fn(),
            findOneByAccountNumber: jest.fn(),
          },
        },
        {
          provide: MarketDataRepository,
          useValue: {
            getMarketValues: jest
              .fn()
              .mockResolvedValue([
                { instrument: { id: 1, ticker: 'HAVA' }, close: 100.5 },
              ]),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  // Additional tests for order creation
  describe('Create', () => {
    it('should successfully execute a buy order', async () => {
      // add a chash to increase the balance
      await service.create({
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

      const result = await service.create(orderDto as CreateOrderDto);

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

      const result = await service.create(invalidOrderDto as CreateOrderDto);
      expect(result.status).toBe(OrderStatus.REJECTED);
    });
  });
});
