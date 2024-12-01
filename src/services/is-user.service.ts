import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class IsUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(accountNumber: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { accountNumber },
    });
    return !!user;
  }
}
