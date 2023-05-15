import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from './filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  // Middleware to exclude /.well-known/ files from the global prefix
  app.use((req, res, next) => {
    if (req.url === '/.well-known/ai-plugin.json') {
      req.url = '/api/.well-known/ai-plugin.json';
    }
    if (req.url === '/.well-known/openapi.yaml') {
      req.url = '/api/.well-known/openapi.yaml';
    }
    next();
  });
  await app.listen(3000);
}
bootstrap();
