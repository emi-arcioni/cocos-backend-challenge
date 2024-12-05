import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(accountNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { accountNumber },
    });
    return user;
  }
}
