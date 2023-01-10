import { GridRowId } from '../../../models/gridRows';

export type GridCellIdentifier = { id: GridRowId; field: string }; // TODO: Reuse GridCellCoordinates
export type GridColumnIdentifier = { field: string };
export type GridColumnGroupIdentifier = { field: string; depth: number };

export interface GridFocusState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColumnIdentifier | null;
  columnGroupHeader: GridColumnGroupIdentifier | null;
}

export interface GridOutlineState {
  cell: GridCellIdentifier | null;
}

export interface GridTabIndexState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColumnIdentifier | null;
  columnGroupHeader: GridColumnGroupIdentifier | null;
}
