import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { SetOrderService } from '../services/set-order.service';
import { CreateOrderDto } from '../entities/dto/create-order.dto';
import { OrderStatus } from '../types/orders';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly setOrderService: SetOrderService) {}

  @Post()
  async setOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Res() response: Response,
  ) {
    const order = await this.setOrderService.execute(createOrderDto);

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
