import { TaskStatus } from '../task.entity';

export class NewTaskDTO {
  full_id: string;
  user_id: number;
  title: string;
  status: TaskStatus;
  manager: string;
}
