import { GridCellValue } from './gridCell';

export interface GridEditCellProps {
  value: GridCellValue;

  [prop: string]: any;
}

export type GridEditRow = { [field: string]: true | GridEditCellProps };
export type GridEditRowsModel = { [rowId: string]: GridEditRow };
