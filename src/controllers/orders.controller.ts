import { Controller, Post, Body } from '@nestjs/common';
import { SetOrderService } from '../services/set-order.service';
import { CreateOrderDto } from 'src/entities/dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly setOrderService: SetOrderService) {}

  @Post()
  async setOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.setOrderService.execute(createOrderDto);
  }
}
