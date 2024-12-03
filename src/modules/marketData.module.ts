import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketData } from '../entities/marketData.entity';
import { MarketDataRepository } from '../repositories/marketData.repository';
import { GetMarketValuesService } from '../services/get-marketvalues.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketData])],
  providers: [MarketDataRepository, GetMarketValuesService],
  exports: [MarketDataRepository, GetMarketValuesService],
})
export class MarketDataModule {}
