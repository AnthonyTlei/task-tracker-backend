import { TaskStatus } from '../task.entity';
import { ImportConversionOptions } from './import-result.dto';

export class JsonTaskDTO {
  // TODO: handle cases where options is partial or null
  constructor(data: any, options?: ImportConversionOptions) {
    this.id = options.idColName ? data[options.idColName] : data.id;
    this.assignee = options.assigneeColName
      ? data[options.assigneeColName]
      : data.assignee;
    this.title = options.titleColName ? data[options.titleColName] : data.title;
    this.manager = options.managerColName
      ? data[options.managerColName]
      : data.manager;
    this.status = options.statusColName
      ? (data[options.statusColName] as TaskStatus)
      : (data.status as TaskStatus);
  }
  id: string;
  assignee: string;
  title: string;
  status: string;
  manager: string;
}
