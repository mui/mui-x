import { GridCellValue } from '../gridCell';
import { GridEditCellProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';

export interface GridEditCellPropsParams {
  id: GridRowId;
  field: string;
  props: GridEditCellProps;
}

export interface GridEditCellValueParams {
  id: GridRowId;
  field: string;
  value: GridCellValue;
}

export interface GridCommitCellChangeParams {
  id: GridRowId;
  field: string;
}
