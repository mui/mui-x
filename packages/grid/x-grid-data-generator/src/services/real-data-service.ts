import { GridRowData } from '@mui/x-data-grid-pro';
import asyncWorker from '../asyncWorker';
import { GridColDefGenerator } from './gridColDefGenerator';

export interface GridDemoData {
  rows: GridRowData[];
  columns: GridColDefGenerator[];
}

export function getRealData(
  rowLength: number,
  columns: GridColDefGenerator[],
): Promise<GridDemoData> {
  return new Promise<GridDemoData>((resolve) => {
    const tasks = { current: rowLength };
    const rows: GridDemoData['rows'] = [];

    function work() {
      const row: any = {};

      for (let j = 0; j < columns.length; j += 1) {
        const column = columns[j];
        if (column.generateData) {
          row[column.field] = column.generateData(row);
        }
      }

      rows.push(row);
      tasks.current -= 1;
    }

    asyncWorker({
      work,
      done: () => resolve({ columns, rows }),
      tasks,
    });
  });
}
