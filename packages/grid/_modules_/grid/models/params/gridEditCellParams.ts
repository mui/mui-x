import { GridCellMode } from '../gridCell';
import { GridEditRowsModel, GridEditRowUpdate } from '../gridEditRowModel';
import { GridRowId } from '../gridRows';

export interface GridEditCellParams {
  id: GridRowId;
  field: string;
  update: GridEditRowUpdate;
}

export interface GridCellModeChangeParams {
  id: GridRowId;
  field: string;
  api: any;
  mode: GridCellMode;
}

export interface GridEditRowModelParams {
  model: GridEditRowsModel;
  api: any;
}
