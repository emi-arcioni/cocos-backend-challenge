import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '../types/orders';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orders: Repository<Order>,
  ) {}

  findAllByAccountNumberAndStatus(
    accountNumber: string,
    status?: OrderStatus,
  ): Promise<Order[]> {
    return this.orders.find({
      where: { user: { accountNumber }, status },
      relations: { instrument: true },
      order: { id: 'ASC' },
    });
  }
}
