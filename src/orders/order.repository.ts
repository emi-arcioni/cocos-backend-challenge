import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { OrderStatus } from './enums/OrderStatus.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orders: Repository<Order>,
  ) {}

  async findAllByAccountNumberAndStatus(
    accountNumber: string,
    status?: OrderStatus,
    entityManager?: EntityManager,
  ): Promise<Order[]> {
    const repo = entityManager?.getRepository(Order) || this.orders;

    return repo.find({
      where: {
        user: { accountNumber },
        status,
      },
      relations: ['instrument', 'user'],
    });
  }

  save(order: Order, entityManager?: EntityManager): Promise<Order> {
    const repo = entityManager?.getRepository(Order) || this.orders;
    return repo.save(order);
  }
}
