import { Task } from '../task.entity';
import { NewTaskDTO, TaskWithWarning } from './new-task.dto';

export enum ErrorType {
  DUPLICATE = 'DUPLICATE',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}

export interface ImportError {
  type: ErrorType;
  message: string;
}

// TODO: refactor into TaskWithError same as warning.
export interface FailTask {
  task: NewTaskDTO;
  error: ImportError;
}

export interface ImportConversionOptions {
  idColName?: string;
  titleColName?: string;
  managerColName?: string;
  assigneeColName?: string;
  statusColName?: string;
}

export interface ImportOptions extends ImportConversionOptions {
  handleErrors?: boolean;
  worksheetName?: string;
}

export interface ImportResults {
  total: number;
  success: Task[];
  warnings: TaskWithWarning[];
  fails: FailTask[];
}
