import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { GetUserService } from '../services/get-user.service';
import { IsValidUserConstraint } from '../validators/is-valid-user.validator';
import { UserExistsGuard } from '../guards/user-exists.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserRepository,
    GetUserService,
    IsValidUserConstraint,
    UserExistsGuard,
  ],
  exports: [
    UserRepository,
    GetUserService,
    IsValidUserConstraint,
    UserExistsGuard,
  ],
})
export class UsersModule {}
