import { GridCellValue } from './gridCell';

export interface GridEditCellProps {
  value: GridCellValue;
  isValidating?: boolean;
  [prop: string]: any;
}

export type GridEditRowProps = { [field: string]: GridEditCellProps };

export type GridEditRowsModel = { [rowId: string]: GridEditRowProps };

export type GridEditMode = 'cell' | 'row';

enum GridEditModes {
  Cell = 'cell',
  Row = 'row',
}

enum GridCellModes {
  Edit = 'edit',
  View = 'view',
}

enum GridRowModes {
  Edit = 'edit',
  View = 'view',
}

export { GridEditModes, GridCellModes, GridRowModes };
