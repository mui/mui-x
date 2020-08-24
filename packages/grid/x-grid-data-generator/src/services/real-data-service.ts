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
      let model: any = {};

      model = columns.reduce((rowData, column) => {
        rowData[column.field] = column.generateData(rowData);
        return rowData;
      }, {});

      data.push(model);
    }
    resolve({ columns, rows: data });
  });
}
