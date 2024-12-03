import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(accountNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { accountNumber },
    });
    return user;
  }
}
