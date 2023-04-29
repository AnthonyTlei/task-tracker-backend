import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User[]> {
    return await this.userService.getUserById(id);
  }

  @Post()
  async getUserByEmail(@Body('email') email: string): Promise<User[]> {
    return this.userService.getUserByEmail(email);
  }
}
