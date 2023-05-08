import { Task } from '../task.entity';
import { TaskWithError, TaskWithWarning } from './new-task.dto';

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
  fails: TaskWithError[];
}
