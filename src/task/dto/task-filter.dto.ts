import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class GetTasksFilterDTO {
  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  range?: [Date, Date];
}
