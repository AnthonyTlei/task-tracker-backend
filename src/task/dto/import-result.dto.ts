import { Task } from '../task.entity';
import { NewTaskDTO, TaskWithError } from './new-task.dto';

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
  success: Task[];
  warnings: NewTaskDTO[];
  fails: TaskWithError[];
}
