import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/user/user.entity';
import { Task } from './task.entity';
import { NewTaskDTO } from './dto/new-task.dto';
import { TaskOwnerGuard } from './guards/taskOwner.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportOptions, ImportResults } from './dto/import-result.dto';
import { Request, Response } from 'express';
import { GetTasksFilterDTO } from './dto/task-filter.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getTasks(@Query() filters: GetTasksFilterDTO): Promise<Task[]> {
    return await this.taskService.getTasksWithUserDetails(filters);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('export')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async exportTasks(@Res() res: Response): Promise<void> {
    await this.taskService.exportTasks();
    res.download('tasks.xlsx');
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getTaskById(@Param('id') id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @UseGuards(JwtGuard, RolesGuard, TaskOwnerGuard)
  @Put(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async updateTask(
    @Param('id') id: number,
    @Body() task: NewTaskDTO,
  ): Promise<Task> {
    return await this.taskService.updateTask(id, task);
  }

  @UseGuards(JwtGuard, RolesGuard, TaskOwnerGuard)
  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async deleteTask(@Param('id') id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Delete()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async deleteAllTasks(): Promise<void> {
    await this.taskService.deleteAllTasks();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post('import')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async importTasks(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<ImportResults> {
    const options: ImportOptions = request.body.options
      ? JSON.parse(request.body.options)
      : undefined;
    return await this.taskService.importTasks(file, options);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async createTask(@Body() task: NewTaskDTO, @Req() req: any): Promise<Task> {
    // TODO: refactor this whole endpoint, create a new guard or change the parameters. Also service.createTask shoudl take an object as parameter instead of all the fields.
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
      task.date_assigned,
      task.date_completed,
    );
  }
}
