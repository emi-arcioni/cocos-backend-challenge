import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { GetUserService } from '../services/get-user.service';
import { IsValidUserConstraint } from '../validators/is-valid-user.validator';
import { UserGuard } from '../guards/user.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, GetUserService, IsValidUserConstraint, UserGuard],
  exports: [UserRepository, GetUserService, IsValidUserConstraint, UserGuard],
})
export class UsersModule {}
