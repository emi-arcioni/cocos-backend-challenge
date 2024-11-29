import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsController } from '../controllers/instruments.controller';
import { GetInstrumentsService } from '../services/get-instruments.service';
import { Instrument } from '../entities/instrument.entity';
import { InstrumentRepository } from '../repositories/instrument.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentsController],
  providers: [GetInstrumentsService, InstrumentRepository],
})
export class InstrumentsModule {}
