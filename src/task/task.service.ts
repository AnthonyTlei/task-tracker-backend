import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
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
    const response = await this.taskRepository.query('CALL get_all_tasks()');
    return response[0];
  }

  async getTaskById(id: number): Promise<Task[] | null> {
    const response = await this.taskRepository.query(
      `CALL get_task_by_id("${id}")`,
    );
    return response[0];
  }
}
