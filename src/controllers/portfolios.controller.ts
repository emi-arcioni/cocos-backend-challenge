import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetPortfolioService } from '../services/get-portfolio.service';
import { UserGuard } from '../guards/user.guard';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly getPortfolioService: GetPortfolioService) {}

  @Get(':accountNumber')
  @UseGuards(UserGuard)
  async findByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const portfolio = await this.getPortfolioService.execute(accountNumber);

    return portfolio;
  }
}
