import { GridColDef, GridRowId } from '@material-ui/x-grid';
import asyncWorker from '../asyncWorker';

export interface DataRowModel {
  id: GridRowId;
  [field: string]: any;
}

export interface GridData {
  columns: GridColDef[];
  rows: DataRowModel[];
}

export function getRealData(rowLength: number, columns: any[]): Promise<GridData> {
  return new Promise<GridData>((resolve) => {
    const tasks = { current: rowLength };
    const data: DataRowModel[] = [];

    function work() {
      const row: any = {};

      for (let j = 0; j < columns.length; j += 1) {
        const column = columns[j];
        if (column.generateData) {
          row[column.field] = column.generateData(row);
        }
      }

      data.push(row);
      tasks.current -= 1;
    }

    asyncWorker({
      work,
      done: () => resolve({ columns, rows: data }),
      tasks,
    });
  });
}
