import { GridCellMode, GridCellValue } from '../gridCell';
import { GridEditRowsModel, GridEditCellProps } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';

import type { GridApi } from '../api/gridApi';

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
  api: GridApi;
  mode: GridCellMode;
}

export interface GridEditRowModelParams {
  model: GridEditRowsModel;
  api: GridApi;
}

export interface GridCommitCellChangeParams {
  id: GridRowId;
  field: string;
}
