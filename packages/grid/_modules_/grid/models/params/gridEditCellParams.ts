import { GridCellMode, GridCellValue } from '../gridCell';
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

export interface GridCellModeChangeParams {
  id: GridRowId;
  field: string;
  api: any;
  mode: GridCellMode;
}

export interface GridCommitCellChangeParams {
  id: GridRowId;
  field: string;
}

export interface GridCellEditCommitParams {
  id: GridRowId;
  field: string;
  value: GridCellValue;
}
