import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/OrderStatus.enum';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async setOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Res() response: Response,
  ) {
    const order = await this.ordersService.create(createOrderDto);

    switch (order.status) {
      case OrderStatus.NEW:
        return response.status(HttpStatus.CREATED).json(order);
      case OrderStatus.FILLED:
        return response.status(HttpStatus.ACCEPTED).json(order);
      case OrderStatus.REJECTED:
        throw new HttpException(order, HttpStatus.BAD_REQUEST);
      default:
        return response.status(HttpStatus.OK).json(order);
    }
  }
}
