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

export interface ImportConversionOptions {
  idColName: string;
  titleColName: string;
  managerColName: string;
  assigneeColName: string;
  statusColName: string;
}

export interface ImportOptions extends ImportConversionOptions {
  handleErrors?: boolean;
}

export interface ImportResults {
  total: number;
  success: Task[];
  fails: FailTask[];
}
