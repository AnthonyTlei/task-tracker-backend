import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get('ping')
  ping() {
    const result = this.testService.ping();
    return result;
  }
}
