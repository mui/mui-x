import { GridCellValue } from './gridCell';
import { GridRowId } from './gridRows';

export interface GridEditCellProps {
  value: GridCellValue;

  [prop: string]: any;
}
export interface GridEditRowUpdate {
  id: GridRowId;
  [prop: string]: GridCellValue | GridEditCellProps;
}

export type GridEditRowsModel = { [rowId: string]: GridEditRowUpdate };