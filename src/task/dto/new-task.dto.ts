import { TaskStatus } from '../task.entity';

// TODO: rename to WarningCode
export enum WarningType {
  INVALID_STATUS = 'INVALID_STATUS',
}

export interface Warning {
  code: WarningType;
  message: string;
}

export interface TaskWithWarning {
  task: NewTaskDTO;
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
