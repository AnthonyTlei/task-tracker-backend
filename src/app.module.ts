import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { TestModule } from './test/test.module';
import { WellKnownModule } from './.well-known/.well-known.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'dev',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TaskModule,
    TestModule,
    WellKnownModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
