import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketData } from './entities/market-data.entity';
import { MarketDataRepository } from './market-data.repository';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketData])],
  providers: [MarketDataRepository, MarketDataService],
  exports: [MarketDataRepository, MarketDataService],
})
export class MarketDataModule {}
