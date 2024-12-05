import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../src/orders/orders.controller';
import { SetOrderService } from '../src/services/set-order.service';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { OrderSide } from '../src/orders/types/orders';

describe('OrdersController', () => {
  let controller: OrdersController;
  let setOrderService: SetOrderService;

  const mockSetOrderService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: SetOrderService,
          useValue: mockSetOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    setOrderService = module.get<SetOrderService>(SetOrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        accountNumber: '1234567890',
        instrumentId: 1,
        quantity: 10,
        price: 100.50,
        side: OrderSide.BUY,
      };

      const expectedResult = {
        id: 1,
        ...createOrderDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSetOrderService.execute.mockResolvedValue(expectedResult);

      const result = await controller.execute(createOrderDto);

      expect(setOrderService.execute).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from service', async () => {
      const createOrderDto: CreateOrderDto = {
        accountNumber: '1234567890',
        instrumentId: 1,
        quantity: 10,
        price: 100.50,
        side: OrderSide.BUY,
      };

      mockSetOrderService.execute.mockRejectedValue(new Error('Service error'));

      await expect(controller.execute(createOrderDto)).rejects.toThrow('Service error');
    });
  });
}); 