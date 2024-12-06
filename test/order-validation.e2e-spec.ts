import * as request from 'supertest';
import { OrderSide } from '../src/orders/enums/OrderSide.enum';
import { OrderType } from '../src/orders/enums/OrderType.enum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import { useContainer } from 'class-validator';
import { OrdersService } from '../src/orders/orders.service';

describe('POST /orders validation', () => {
  let app: INestApplication;
  let module: TestingModule;
  let ordersService: OrdersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrdersService)
      .useValue({
        create: jest.fn().mockResolvedValue({}),
      })
      .compile();

    app = module.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    ordersService = module.get<OrdersService>(OrdersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send();

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'accountNumber should not be empty',
    );
    expect(response.body.message).toContain('type should not be empty');
    expect(response.body.message).toContain(
      'type must be one of the following values: MARKET, LIMIT',
    );
    expect(response.body.message).toContain('ticker should not be empty');
    expect(response.body.message).toContain('size should not be empty');
    expect(response.body.message).toContain('size must be a positive number');
    expect(response.body.message).toContain('size must be an integer number');
    expect(response.body.message).toContain('price should not be empty');
    expect(response.body.message).toContain('price must be a positive number');
    expect(response.body.message).toContain(
      'price must be a number conforming to the specified constraints',
    );
    expect(response.body.message).toContain('side should not be empty');
    expect(response.body.message).toContain(
      'side must be one of the following values: BUY, SELL, CASH_IN, CASH_OUT',
    );
  });

  it('should return 400 when accountNumber is invalid', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      accountNumber: 'TEST',
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      ticker: 'HAVA',
      size: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('User TEST is not valid');
  });

  it('should validate type and ticker for non-cash orders', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      accountNumber: '12345',
      side: OrderSide.BUY,
      size: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'type must be one of the following values: MARKET, LIMIT',
    );
    expect(response.body.message).toContain('type should not be empty');
    expect(response.body.message).toContain('ticker should not be empty');
  });

  it('should not require type and ticker for cash orders', async () => {
    const orderData = {
      accountNumber: '10001',
      side: OrderSide.CASH_IN,
      size: 100,
    };

    await request(app.getHttpServer()).post('/orders').send(orderData);
    expect(ordersService.create).toHaveBeenCalledWith(orderData);
  });

  it('should validate size for sell and cash orders', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      accountNumber: '10001',
      side: OrderSide.SELL,
      type: OrderType.MARKET,
      ticker: 'HAVA',
      size: -1,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('size must be a positive number');
  });

  it('should validate investmentAmount for buy orders without size', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      accountNumber: '10001',
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      ticker: 'HAVA',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'investmentAmount must be a positive number',
    );
    expect(response.body.message).toContain(
      'investmentAmount must be a number conforming to the specified constraints',
    );
    expect(response.body.message).toContain(
      'investmentAmount should not be empty',
    );
  });

  it('should validate price for limit orders', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      accountNumber: '10001',
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      ticker: 'HAVA',
      size: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('price must be a positive number');
    expect(response.body.message).toContain(
      'price must be a number conforming to the specified constraints',
    );
    expect(response.body.message).toContain('price should not be empty');
  });

  it('should accept valid market buy order with size', async () => {
    const orderData = {
      accountNumber: '10001',
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      ticker: 'HAVA',
      size: 100,
    };

    await request(app.getHttpServer()).post('/orders').send(orderData);
    expect(ordersService.create).toHaveBeenCalledWith(orderData);
  });

  it('should accept valid market buy order with investment amount', async () => {
    const orderData = {
      accountNumber: '10001',
      side: OrderSide.BUY,
      type: OrderType.MARKET,
      ticker: 'HAVA',
      investmentAmount: 1000000,
    };

    await request(app.getHttpServer()).post('/orders').send(orderData);
    expect(ordersService.create).toHaveBeenCalledWith(orderData);
  });
});
