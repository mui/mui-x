import { GridCellMode } from '../gridCell';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridRowId, GridRowModelUpdate } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';

export interface GridEditRowApi {
  setEditRowsModel: (model: GridEditRowsModel) => void;
  setCellMode: (rowId: GridRowId, field: string, mode: GridCellMode) => void;
  isCellEditable: (params: GridCellParams) => boolean;
  setEditCellValue: (update: GridRowModelUpdate) => void;
  commitCellValueChanges: (update: GridRowModelUpdate) => void;

  onEditRowModelChange: (handler: (param: { update: GridRowModelUpdate }) => void) => void;
  onCellModeChange: (handler: (param: { update: GridRowModelUpdate }) => void) => void;
  onEditCellValueChangeCommitted: (
    handler: (param: { update: GridRowModelUpdate }) => void,
  ) => void;
  onEditCellValueChange: (handler: (param: { update: GridRowModelUpdate }) => void) => void;
}
