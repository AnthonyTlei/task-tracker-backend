import { Task, TaskStatus } from '../task.entity';

export enum WarningCode {
  INVALID_STATUS = 'INVALID_STATUS',
}

export enum ErrorCode {
  DUPLICATE = 'DUPLICATE',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}

export interface Warning {
  code: WarningCode;
  message: string;
}

export interface Error {
  code: ErrorCode;
  message: string;
}

export interface TaskWithError {
  task: NewTaskDTO;
  error: Error;
}

export interface TaskWithWarning {
  task: Task;
  warning: Warning;
}

export class NewTaskDTO {
  full_id: string;
  user_id: number;
  title: string;
  status: TaskStatus;
  manager: string;
  warning?: Warning;
}
