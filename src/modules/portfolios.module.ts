import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfoliosController } from '../controllers/portfolios.controller';
import { GetPortfolioService } from '../services/get-portfolio.service';
import { User } from '../entities/user.entity';
import { MarketData } from '../entities/marketData.entity';
import { Order } from '../entities/order.entity';
import { OrdersModule } from './orders.module';
import { UsersModule } from './users.module';
import { MarketDataModule } from './marketData.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, MarketData]),
    forwardRef(() => OrdersModule),
    UsersModule,
    MarketDataModule,
  ],
  controllers: [PortfoliosController],
  providers: [GetPortfolioService],
  exports: [GetPortfolioService],
})
export class PortfoliosModule {}
