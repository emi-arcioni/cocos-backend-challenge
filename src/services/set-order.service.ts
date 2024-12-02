import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../entities/dto/create-order.dto';
import { GetInstrumentService } from './get-instrument.service';

@Injectable()
export class SetOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly getInstrumentService: GetInstrumentService,
  ) {}

  async execute(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.type = createOrderDto.type;
    order.instrument = await this.getInstrumentService.execute(
      createOrderDto.ticker,
    );
    return this.orderRepository.save(order);
  }
}
