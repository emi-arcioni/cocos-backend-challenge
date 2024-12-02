import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from '../controllers/portfolios.controller';
import { GetPortfolioService } from '../services/get-portfolio.service';
import { User } from '../entities/user.entity';
import { MarketData } from '../entities/marketData.entity';
import { Order } from '../entities/order.entity';
import { MarketDataRepository } from '../repositories/marketData.repository';
import { OrdersModule } from './orders.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, MarketData]),
    OrdersModule,
    UsersModule,
  ],
  controllers: [PortfoliosController],
  providers: [
    GetPortfolioService,
    MarketDataRepository, // In a future this should have it's own module
  ],
})
export class PortfoliosModule {}
