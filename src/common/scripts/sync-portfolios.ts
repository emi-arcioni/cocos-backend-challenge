import { Command, CommandRunner } from 'nest-commander';
import { UserRepository } from '../../users/user.repository';
import { Injectable } from '@nestjs/common';
import { PortfoliosService } from '../../portfolios/portfolios.service';

@Injectable()
@Command({
  name: 'sync-portfolios',
  description: 'Sync all portfolios',
})
export class SyncPortfoliosCommand extends CommandRunner {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly portfoliosService: PortfoliosService,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      const users = await this.userRepository.findAll();
      for (const user of users) {
        await this.portfoliosService.upsert(user.accountNumber);
      }
      console.log('Portfolios synced successfully');
    } catch (error) {
      console.error('Error syncing portfolios:', error);
      process.exit(1);
    }
  }
}
