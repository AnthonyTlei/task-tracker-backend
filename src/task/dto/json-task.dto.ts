import { TaskStatus } from '../task.entity';
import { ImportConversionOptions } from './import-result.dto';
import { Warning } from './new-task.dto';

export class JsonTaskDTO {
  constructor(data: any, options?: ImportConversionOptions) {
    this.id = options.idColName ? data[options.idColName] : data.id;
    this.assignee = options.assigneeColName
      ? data[options.assigneeColName]
      : data.assignee;
    this.title = options.titleColName ? data[options.titleColName] : data.title;
    this.manager = options.managerColName
      ? data[options.managerColName]
      : data.manager;
    const statusValue = options.statusColName
      ? data[options.statusColName]?.toLowerCase()
      : data.status?.toLowerCase();
    this.status = Object.values(TaskStatus).includes(statusValue)
      ? (statusValue as TaskStatus)
      : TaskStatus.UNKNOWN;
  }
  id: string;
  assignee: string;
  title: string;
  status: string;
  manager: string;
  warning?: Warning;
}
