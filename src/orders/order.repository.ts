import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { OrderStatus } from './enums/OrderStatus.enum';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectRepository(Order)
    private orders: Repository<Order>,
  ) {}

  async findAllByAccountNumberAndStatus(
    accountNumber: string,
    status?: OrderStatus,
    entityManager?: EntityManager,
  ): Promise<Order[]> {
    this.logger.debug(
      `Finding orders for account ${accountNumber} with status ${status}`,
    );
    const repo = entityManager?.getRepository(Order) || this.orders;

    try {
      const orders = await repo.find({
        where: {
          user: { accountNumber },
          status,
        },
        relations: ['instrument', 'user'],
      });
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to find orders for account ${accountNumber}`,
        error.stack,
      );
      throw error;
    }
  }

  async save(order: Order, entityManager?: EntityManager): Promise<Order> {
    const repo = entityManager?.getRepository(Order) || this.orders;
    try {
      const savedOrder = await repo.save(order);
      this.logger.debug(`Successfully saved order ${order.id}`);
      return savedOrder;
    } catch (error) {
      this.logger.error(
        `Database error while saving order ${order.id}`,
        error.stack,
      );
      throw error;
    }
  }
}
