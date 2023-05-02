import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getTaskById(id: number): Promise<Task[]> {
    const task = await this.taskRepository.find({ where: { id } });
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
}
