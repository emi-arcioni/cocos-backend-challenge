import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { SetOrderService } from '../services/set-order.service';
import { OrdersController } from '../controllers/orders.controller';
import { User } from '../entities/user.entity';
import { InstrumentsModule } from './instruments.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    InstrumentsModule,
    UsersModule,
  ],
  providers: [OrderRepository, SetOrderService],
  controllers: [OrdersController],
  exports: [OrderRepository, SetOrderService],
})
export class OrdersModule {}
