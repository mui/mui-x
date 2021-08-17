import { GridCellValue } from './gridCell';

export interface GridEditCellProps {
  value: GridCellValue;
  [prop: string]: any;
}

export type GridEditRowProps = { [field: string]: GridEditCellProps };

export type GridEditRowsModel = { [rowId: string]: GridEditRowProps };

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
