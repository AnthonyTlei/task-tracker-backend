import * as fs from 'fs';
import * as path from 'path';
import {
  ImportConversionOptions,
  ImportOptions,
} from 'src/task/dto/import-result.dto';
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

export function excelDateToJSDate(serial: number) {
  const tempDate = new Date(1899, 11, 31);
  const date = new Date(
    tempDate.getTime() + (serial - 1) * 24 * 60 * 60 * 1000,
  );
  return date;
}

export function convertExcelToJSON(
  file: Express.Multer.File,
  options?: ImportOptions,
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
  const worksheetName = options?.worksheetName
    ? options.worksheetName
    : 'Tasks';
  const worksheet = workbook.Sheets[worksheetName];
  const data: JsonTaskDTO[] = XLSX.utils.sheet_to_json(worksheet);
  return data;
}

export function convertJSONToExcel(data: any) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
  XLSX.writeFile(workbook, 'tasks.xlsx');
}
