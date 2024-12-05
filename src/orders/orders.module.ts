import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { User } from '../users/entities/user.entity';
import { InstrumentsModule } from '../instruments/instruments.module';
import { UsersModule } from '../users/users.module';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    InstrumentsModule,
    UsersModule,
    forwardRef(() => PortfoliosModule),
    MarketDataModule,
  ],
  providers: [OrderRepository, OrdersService],
  controllers: [OrdersController],
  exports: [OrderRepository, OrdersService],
})
export class OrdersModule {}
