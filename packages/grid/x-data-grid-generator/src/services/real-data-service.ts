import { GridRowModel } from '@mui/x-data-grid-pro';
import asyncWorker from '../asyncWorker';
import { GridColDefGenerator, GridDataGeneratorContext } from './gridColDefGenerator';

export interface GridDemoData {
  rows: GridRowModel[];
  columns: GridColDefGenerator[];
}

type DataGeneratorIndexedValues = { [field: string]: { [value: string]: number } };

const generateRow = (columns: GridColDefGenerator[], indexedValues: DataGeneratorIndexedValues) => {
  const row: any = {};

  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];
    if (column.generateData) {
      const context: GridDataGeneratorContext = {};
      if (column.dataGeneratorUniquenessEnabled) {
        let fieldValues = indexedValues[column.field];
        if (!fieldValues) {
          fieldValues = {};
          indexedValues[column.field] = fieldValues;
        }

        context.values = fieldValues;
      }

      row[column.field] = column.generateData(row, context);
    }
  }

  return row;
};

export const getRealGridDataSync = (rowLength: number, columns: GridColDefGenerator[]) => {
  const indexedValues: DataGeneratorIndexedValues = {};
  const rows: GridRowModel[] = [];

  for (let i = 0; i < rowLength; i += 1) {
    rows.push(generateRow(columns, indexedValues));
  }

  return {
    columns,
    rows,
  };
};

export function getRealGridData(
  rowLength: number,
  columns: GridColDefGenerator[],
): Promise<GridDemoData> {
  return new Promise<GridDemoData>((resolve) => {
    const tasks = { current: rowLength };
    const rows: GridRowModel[] = [];
    const indexedValues: DataGeneratorIndexedValues = {};

    function work() {
      const row = generateRow(columns, indexedValues);

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
