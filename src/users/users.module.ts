import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { UserExistsGuard } from './guards/user-exists.guard';
import { IsValidUserConstraint } from './validators/is-valid-user.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserRepository,
    UsersService,
    IsValidUserConstraint,
    UserExistsGuard,
  ],
  exports: [
    UserRepository,
    UsersService,
    IsValidUserConstraint,
    UserExistsGuard,
  ],
})
export class UsersModule {}
