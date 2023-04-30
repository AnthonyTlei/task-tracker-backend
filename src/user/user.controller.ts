import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

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

  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN)
  async getUserByEmail(@Body('email') email: string): Promise<User[]> {
    return this.userService.getUserByEmail(email);
  }
}
