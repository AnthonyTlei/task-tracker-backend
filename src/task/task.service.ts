import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewTaskDTO } from './dto/new-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /* These Methods can be directly called by controllers. */
  async getTasks(): Promise<Task[] | null> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTasksWithUsers(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({ relations: ['user'] });
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

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
