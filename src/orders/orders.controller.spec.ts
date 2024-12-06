import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSide } from './enums/orderSide.enum';
import { Response } from 'express';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        accountNumber: '1234567890',
        ticker: 'HAVA',
        size: 10,
        price: 100.5,
        side: OrderSide.BUY,
      } as CreateOrderDto;

      const expectedResult = {
        id: 1,
        ...createOrderDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersService.create.mockResolvedValue(expectedResult);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue(expectedResult),
      };
      const result = await controller.setOrder(
        createOrderDto,
        mockResponse as unknown as Response,
      );

      expect(ordersService.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from service', async () => {
      const createOrderDto: CreateOrderDto = {
        accountNumber: '1234567890',
        ticker: 'HAVA',
        size: 10,
        price: 100.5,
        side: OrderSide.BUY,
      } as CreateOrderDto;

      mockOrdersService.create.mockRejectedValue(new Error('Service error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await expect(
        controller.setOrder(
          createOrderDto,
          mockResponse as unknown as Response,
        ),
      ).rejects.toThrow('Service error');
    });
  });
});
