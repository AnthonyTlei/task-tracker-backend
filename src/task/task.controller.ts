import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/user/user.entity';
import { Task } from './task.entity';
import { NewTaskDTO } from './dto/new-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getTasks();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async createTask(@Body() task: NewTaskDTO, @Req() req: any): Promise<Task> {
    const { user } = req.user;
    const user_id = user.id;
    if (user_id != task.user_id) {
      throw new HttpException('Invalid user id', HttpStatus.UNAUTHORIZED);
    }
    return await this.taskService.createTask(
      task.full_id,
      task.user_id,
      task.title,
      task.status,
      task.manager,
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async deleteTask(@Param('id') id: number, @Req() req: any): Promise<Task> {
    const { user } = req.user;
    const user_id = user.id;
    const task = await this.taskService.getTaskById(id);
    if (user_id != task.user_id) {
      throw new HttpException('Invalid user id', HttpStatus.UNAUTHORIZED);
    }
    return task;
  }
}