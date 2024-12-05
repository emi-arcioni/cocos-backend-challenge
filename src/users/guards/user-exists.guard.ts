import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountNumber = request.params.accountNumber;

    const user = await this.usersService.findOne(accountNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}
