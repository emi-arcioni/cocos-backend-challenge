import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosService } from './portfolios.service';
import { OrderRepository } from '../orders/order.repository';
import { MarketDataService } from '../market-data/market-data.service';
import { MarketDataRepository } from '../market-data/market-data.repository';
import { PortfolioRepository } from './portfolio.repository';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/user.repository';
import { Portfolio } from './entities/portfolio.entity';

describe('PortfoliosService', () => {
  let service: PortfoliosService;
  let mockPortfolioRepository: Partial<PortfolioRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    mockPortfolioRepository = {
      upsert: jest.fn().mockResolvedValue({}),
    };

    module = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        UsersService,
        MarketDataService,
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
          provide: PortfolioRepository,
          useValue: mockPortfolioRepository,
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
          provide: OrderRepository,
          useValue: {
            findAllByAccountNumberAndStatus: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get portfolio for account', async () => {
    const portfolio: Portfolio = {
      userId: 111,
      user: {
        id: 111,
        email: 'test@test.com',
        accountNumber: '1234567890',
        orders: [],
      },
      balance: 0,
      overview: [],
    };

    mockPortfolioRepository.upsert = jest.fn().mockResolvedValue(portfolio);

    const result = await service.sync('1234567890');
    expect(result).toEqual(portfolio);
  });
});
