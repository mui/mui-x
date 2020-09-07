import { ColDef, RowId } from '@material-ui/x-grid';

export interface DataRowModel {
  id: RowId;
  [field: string]: any;
}

export interface GridData {
  columns: ColDef[];
  rows: DataRowModel[];
}

export function getRealData(rowLength: number, columns: any[]): Promise<GridData> {
  return new Promise<GridData>((resolve) => {
    const data: DataRowModel[] = [];
    for (let i = 0; i < rowLength; i += 1) {
      const row: any = {};

      for (let j = 0; j < columns.length; j += 1) {
        const column = columns[j];
        row[column.field] = column.generateData(row);
      }

      data.push(row);
    }

    resolve({ columns, rows: data });
  });
}
