import { ImportConversionOptions } from './import-result.dto';

export class JsonTaskDTO {
  // TODO: handle cases where options is partial or null
  constructor(data: any, options?: ImportConversionOptions) {
    this.id = data[options.idColName];
    this.assignee = data[options.assigneeColName];
    this.title = data[options.titleColName];
    this.manager = data[options.managerColName];
  }
  id: string;
  assignee: string;
  title: string;
  status: string;
  manager: string;
}
