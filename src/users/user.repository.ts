import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  findOne(options: FindOneOptions<User>): Promise<User | undefined> {
    return this.users.findOne(options);
  }

  findAll(): Promise<User[]> {
    return this.users.find();
  }
}
