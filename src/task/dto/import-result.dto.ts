import { Task } from '../task.entity';
import { NewTaskDTO } from './new-task.dto';

export enum ErrorType {
  DUPLICATE = 'DUPLICATE',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}

export interface ImportError {
  type: ErrorType;
  message: string;
}

export interface FailTask {
  task: NewTaskDTO;
  error: ImportError;
}

export interface ImportResults {
  total: number;
  success: Task[];
  fails: FailTask[];
}
