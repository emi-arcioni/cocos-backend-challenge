import { Test, TestingModule } from '@nestjs/testing';
import { SetAccountOverviewService } from '../src/services/set-accountoverview.service';
import { OrderRepository } from '../src/orders/order.repository';
import { OrderStatus, OrderSide, OrderType } from '../src/orders/types/orders';
import { Order } from '../src/orders/entities/order.entity';
import { GetMarketValuesService } from '../src/services/get-marketvalues.service';
import { MarketDataRepository } from '../src/market-data/market-data.repository';
import { User } from '../src/entities/user.entity';
import { InstrumentType } from '../src/instruments/types/instruments';

describe('Set AccountOverviewService', () => {
  let service: SetAccountOverviewService;
  let mockOrderRepository: Partial<OrderRepository>;
  let module: TestingModule;
  let orders: Order[] = [];

  beforeEach(async () => {
    mockOrderRepository = {
      findAllByAccountNumberAndStatus: jest.fn().mockResolvedValue([]),
    };

    module = await Test.createTestingModule({
      providers: [
        SetAccountOverviewService,
        GetMarketValuesService,
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
        {
          provide: OrderRepository,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<SetAccountOverviewService>(SetAccountOverviewService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get portfolio for account', async () => {
    const user = {
      id: 1,
      accountNumber: '1234567890',
      email: 'test@test.com',
    } as User;
    orders = [
      {
        id: 1,
        instrument: {
          ticker: 'ARS',
          id: 66,
          type: InstrumentType.MONEDA,
          name: 'PESOS',
        },
        price: 1,
        size: 100000,
        side: OrderSide.CASH_IN,
      } as Order,
      {
        id: 2,
        user,
        instrument: {
          ticker: 'HAVA',
          id: 64,
          type: InstrumentType.ACCIONES,
          name: 'Havanna Holding',
        },
        size: 10,
        side: OrderSide.BUY,
        type: OrderType.MARKET,
        price: 100.5,
      } as Order,
      {
        id: 3,
        user,
        instrument: {
          ticker: 'HAVA',
          id: 64,
          type: InstrumentType.ACCIONES,
          name: 'Havanna Holding',
        },
        size: 5,
        side: OrderSide.SELL,
        type: OrderType.MARKET,
        price: 105.0,
      } as Order,
    ];

    mockOrderRepository.findAllByAccountNumberAndStatus = jest
      .fn()
      .mockResolvedValue(orders);

    const result = await service.execute('1234567890');

    expect(result).toBeDefined();
    expect(
      mockOrderRepository.findAllByAccountNumberAndStatus,
    ).toHaveBeenCalledWith('1234567890', OrderStatus.FILLED);

    expect(result).toEqual({
      balance: 99520,
      assets: [
        expect.objectContaining({
          instrument: {
            ticker: 'HAVA',
            name: 'Havanna Holding',
          },
          totalShares: 5,
          averagePrice: 100.5,
          marketValue: 502.5,
          netProfit: 22.5,
          totalCost: 502.5,
          unrealizedPnL: 0,
          totalProfit: 22.5,
          performance: 4.48,
        }),
      ],
    });
  });
});
