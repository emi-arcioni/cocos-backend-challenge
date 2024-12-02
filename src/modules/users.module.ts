import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { IsUserService } from '../services/is-user.service';
import { IsValidUserConstraint } from '../validators/is-valid-user.validator';
import { UserGuard } from '../guards/user.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, IsUserService, IsValidUserConstraint, UserGuard],
  exports: [UserRepository, IsUserService, IsValidUserConstraint, UserGuard],
})
export class UsersModule {}
