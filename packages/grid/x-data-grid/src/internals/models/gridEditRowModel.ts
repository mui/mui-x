import { GridCellValue } from './gridCell';

export interface GridEditCellProps {
  value: GridCellValue;
  isValidating?: boolean;
  isProcessingProps?: boolean;
  [prop: string]: any;
}

export type GridEditRowProps = { [field: string]: GridEditCellProps };

// TODO v6: rename to GridEditingState
export type GridEditRowsModel = { [rowId: string]: GridEditRowProps };

export type GridEditingState = GridEditRowsModel;

export type GridEditMode = 'cell' | 'row';

export enum GridEditModes {
  Cell = 'cell',
  Row = 'row',
}

export enum GridCellModes {
  Edit = 'edit',
  View = 'view',
}

export enum GridRowModes {
  Edit = 'edit',
  View = 'view',
}
