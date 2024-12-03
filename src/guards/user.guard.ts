import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { GetUserService } from '../services/get-user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly getUserService: GetUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountNumber = request.params.accountNumber;

    const user = await this.getUserService.execute(accountNumber);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}
