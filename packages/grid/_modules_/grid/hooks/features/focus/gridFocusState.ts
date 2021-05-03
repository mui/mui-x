import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridRowId } from '../../../models/gridRows';

export type GridCellIdentifier =  {id: GridRowId, field: string};
export type GridColIdentifier =  { field: string};

export interface GridFocusState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColIdentifier | null;
}

export interface GridTabIndexState {
  cell: GridCellIdentifier | null;
  columnHeader: GridColIdentifier | null;
}
