import * as fs from 'fs';
import * as path from 'path';
import { JsonTaskDTO } from 'src/task/dto/json-task.dto';
import * as XLSX from 'xlsx';

function isValidExcelFile(file: Express.Multer.File) {
  if (
    ![
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ].includes(file.mimetype)
  ) {
    return false;
  }
  return true;
}

export interface convertExcelToJSONOptions {
  worksheetName: string;
}

export function convertExcelToJSON(
  file: Express.Multer.File,
  options?: convertExcelToJSONOptions,
): JsonTaskDTO[] {
  if (!isValidExcelFile(file)) {
    throw new Error('Invalid Excel File');
  }
  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  const filePath = path.join(tempDir, 'tasks.xlsx');
  fs.writeFileSync(filePath, file.buffer);

  const workbook = XLSX.readFile(filePath);
  const worksheetName = options?.worksheetName || 'Tasks';
  const worksheet = workbook.Sheets[worksheetName];
  const data: JsonTaskDTO[] = XLSX.utils.sheet_to_json(worksheet);
  return data;
  //   const outputFilePath = path.join(__dirname, '..', 'temp', 'output.json');
  //   fs.writeFileSync(outputFilePath, JSON.stringify(data));
}
