export interface GridEditCellProps<V = any> {
  value: V;
  isValidating?: boolean;
  isProcessingProps?: boolean;
  [prop: string]: any;
}

export type GridEditRowProps = { [field: string]: GridEditCellProps };

// TODO v6: rename to GridEditingState
export type GridEditRowsModel = { [rowId: string]: GridEditRowProps };

export type GridEditingState = GridEditRowsModel;

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
