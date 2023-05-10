import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Error,
  ErrorCode,
  NewTaskDTO,
  TaskWithError,
  TaskWithWarning,
  Warning,
  WarningCode,
} from './dto/new-task.dto';
import { convertExcelToJSON } from 'src/helpers/excel';
import { JsonTaskDTO } from './dto/json-task.dto';
import { UserService } from 'src/user/user.service';
import {
  ImportConversionOptions,
  ImportOptions,
  ImportResults,
} from './dto/import-result.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  /* Utilities */

  _parseError(error: any): Error {
    const errorString = JSON.stringify(error);
    const jsonError = JSON.parse(errorString);
    let errorCode = ErrorCode.UNKNOWN;
    let message = 'Unknown Error';
    switch (jsonError.driverError.code) {
      case 'ER_DUP_ENTRY':
        errorCode = ErrorCode.DUPLICATE;
        message =
          'Duplicate Entry for task with id: ' + jsonError.parameters[0];
        break;
      default:
        errorCode = ErrorCode.UNKNOWN;
        break;
    }
    const parsedError: Error = {
      code: errorCode,
      message,
    };
    return parsedError;
  }

  _cleanData = (
    data: any,
    options?: ImportConversionOptions,
  ): JsonTaskDTO[] => {
    try {
      const jsonTaskDTOArray = data.map((item) => {
        const task = new JsonTaskDTO(item, options);

        // TODO: refactor into _check_for_warnings
        if (task.status === 'unknown') {
          const warning: Warning = {
            code: WarningCode.INVALID_STATUS,
            message: 'Invalid status: ' + item.status,
          };
          task.warning = warning;
        }

        return task;
      });

      return jsonTaskDTOArray;
    } catch (error) {
      throw error;
    }
  };

  async _convertJsonToTask(data: JsonTaskDTO[]): Promise<NewTaskDTO[]> {
    const tasks: NewTaskDTO[] = [];
    for (const entry of data) {
      const user = await this.userService._getUserByFirstName(entry.assignee);
      const userId = user?.id || 1;
      const task: NewTaskDTO = {
        full_id: entry.id,
        user_id: userId,
        title: entry.title,
        status:
          (entry.status?.toLowerCase() as TaskStatus) || TaskStatus.UNKNOWN,
        manager: entry.manager,
        warning: entry.warning ? entry.warning : undefined,
      };
      tasks.push(task);
    }
    return tasks;
  }

  async _createTasks(tasks: NewTaskDTO[]): Promise<ImportResults> {
    const success: Task[] = [];
    const warnings: TaskWithWarning[] = [];
    const fails: TaskWithError[] = [];
    for (const taskDTO of tasks) {
      try {
        // TODO: figure out why i cant pass taskDTO directly to createTask
        const newTask = await this.createTask(
          taskDTO.full_id,
          taskDTO.user_id,
          taskDTO.title,
          taskDTO.status,
          taskDTO.manager,
        );
        if (taskDTO.warning) {
          const taskWithWarning: TaskWithWarning = {
            task: newTask,
            warning: taskDTO.warning,
          };
          warnings.push(taskWithWarning);
        } else {
          success.push(newTask);
        }
      } catch (error) {
        const parsedError = this._parseError(error);
        const failedTask: TaskWithError = {
          task: taskDTO,
          error: parsedError,
        };
        fails.push(failedTask);
        continue;
      }
    }
    const results: ImportResults = {
      success,
      warnings,
      fails,
    };
    return results;
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
    try {
      await this.taskRepository.save(newTask);
    } catch (error) {
      throw error;
    }
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

  async deleteAllTasks(): Promise<void> {
    // TODO: check if there's a better way to do this
    const tasks = await this.taskRepository.find();
    for (const task of tasks) {
      await this.taskRepository.delete({ id: task.id });
    }
  }

  async importTasks(
    file: Express.Multer.File,
    options?: ImportOptions,
  ): Promise<ImportResults> {
    const data = convertExcelToJSON(file);
    const cleanedData = this._cleanData(
      data,
      options as ImportConversionOptions,
    );
    const tasks = await this._convertJsonToTask(cleanedData);
    const importResult = await this._createTasks(tasks);
    return importResult;
  }
}
