import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { IsUserService } from '../services/is-user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly isUserService: IsUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountNumber = request.params.accountNumber;

    const userExists = await this.isUserService.execute(accountNumber);

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}
