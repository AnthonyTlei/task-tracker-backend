import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewTaskDTO } from './dto/new-task.dto';
import { convertExcelToJSON } from 'src/helpers/excel';
import { JsonTaskDTO } from './dto/json-task.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  /* Utilities */
  async _convertJsonToTask(data: JsonTaskDTO[]): Promise<NewTaskDTO[]> {
    const tasks: NewTaskDTO[] = [];
    for (const entry of data) {
      // TODO: map the users to user_id?
      const user = await this.userService._getUserByFirstName(entry.assignee);
      const userId = user?.id || 1;
      const task: NewTaskDTO = {
        full_id: entry.id,
        user_id: userId,
        title: entry.title || '',
        status: entry.status.toLowerCase() as TaskStatus,
        manager: entry.manager,
      };
      tasks.push(task);
    }
    return tasks;
  }

  async _createTasks(tasks: NewTaskDTO[]): Promise<Task[]> {
    const newTasks: Task[] = [];
    for (const task of tasks) {
      const newTask = await this.createTask(
        task.full_id,
        task.user_id,
        task.title,
        task.status,
        task.manager,
      );
      newTasks.push(newTask);
    }
    return newTasks;
  }

  /* These Methods can be directly called by controllers. */
  async getTasks(): Promise<Task[] | null> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTasksWithUsers(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({ relations: ['user'] });
    return tasks;
  }

  async getTasksWithUserDetails(): Promise<Task[]> {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .select([
        'task',
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.role',
      ])
      .getMany();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return task;
  }

  async createTask(
    full_id: string,
    user_id: number,
    title: string,
    status: TaskStatus,
    manager: string,
  ): Promise<Task> {
    const newTask = this.taskRepository.create({
      full_id,
      user_id,
      title,
      status,
      manager,
    });
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async updateTask(id: number, task: NewTaskDTO): Promise<Task> {
    const existingTask = await this.taskRepository.findOne({ where: { id } });
    if (!existingTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    // TODO: Validate the fields (for create too)
    Object.assign(existingTask, task);
    return await this.taskRepository.save(existingTask);
  }

  async deleteTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    await this.taskRepository.delete(id);
    return task;
  }

  async importTasks(file: Express.Multer.File): Promise<Task[]> {
    const data = convertExcelToJSON(file);
    const tasks = await this._convertJsonToTask(data);
    const newTasks = await this._createTasks(tasks);
    return newTasks;
  }
}
