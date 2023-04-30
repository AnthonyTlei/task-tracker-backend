import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from './user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserDetails } from './user-details.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUsers(): Promise<UserDetails[]> {
    return await this.userService.getUsersDetails();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUser(@Param('id') id: number): Promise<UserDetails[]> {
    return await this.userService.getUserDetailsById(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUserByEmail(@Body('email') email: string): Promise<UserDetails[]> {
    return this.userService.getUserDetailsByEmail(email);
  }
}
