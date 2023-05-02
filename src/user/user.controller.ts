import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  @Get(':id/tasks')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUserTasks(@Param('id') id: number, @Req() req: any) {
    const { user } = req.user;
    const user_id = user.id;
    if (user_id != id) {
      throw new Error('You are not allowed to see this user tasks');
    }
    const tasks = await this.userService.getUserTasks(id);
    return tasks;
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUsers(): Promise<UserDetails[]> {
    return await this.userService.getUsersDetails();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUser(@Param('id') id: number): Promise<UserDetails> {
    return await this.userService.getUserDetailsById(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getUserByEmail(@Body('email') email: string): Promise<UserDetails> {
    return this.userService.getUserDetailsByEmail(email);
  }
}
