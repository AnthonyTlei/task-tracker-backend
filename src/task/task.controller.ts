import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
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

import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN)
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getTasksWithUserDetails();
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

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importTasks(@UploadedFile() file: Express.Multer.File) {
    if (
      ![
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException('Invalid file type');
    }
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const filePath = path.join(tempDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const workbook = XLSX.readFile(filePath);
    const worksheetName = 'Tasks';
    const worksheet = workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const outputFilePath = path.join(__dirname, '..', 'temp', 'output.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(data));
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
    );
  }
}
