import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiWorks(): string {
    return 'API Works!';
  }
}
