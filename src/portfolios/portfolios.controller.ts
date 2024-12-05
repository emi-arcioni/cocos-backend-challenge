import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { UserExistsGuard } from '../users/guards/user-exists.guard';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get(':accountNumber')
  @UseGuards(UserExistsGuard)
  async findByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const portfolio =
      await this.portfoliosService.findOneByAccountNumber(accountNumber);
    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio not found for account number ${accountNumber}`,
      );
    }

    return portfolio;
  }
}
