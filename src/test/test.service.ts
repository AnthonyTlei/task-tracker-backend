import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  ping(): string {
    return 'Pong';
  }
}
