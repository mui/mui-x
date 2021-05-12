import { GridRowId } from '../../../models/gridRows';

export type GridCellIdentifier = { id: GridRowId; field: string };
export type GridColumnIdentifier = { field: string };

export interface GridFocusState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColumnIdentifier | null;
}

export interface GridTabIndexState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColumnIdentifier | null;
}
