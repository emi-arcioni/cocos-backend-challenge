import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetPortfolioService } from '../services/get-portfolio.service';
import { UserExistsGuard } from '../guards/user-exists.guard';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly getPortfolioService: GetPortfolioService) {}

  @Get(':accountNumber')
  @UseGuards(UserExistsGuard)
  async findByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const portfolio = await this.getPortfolioService.execute(accountNumber);

    return portfolio;
  }
}
