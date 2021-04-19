import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';

export interface GridFocusState {
  cell: GridCellIndexCoordinates | null;
  columnHeader: GridColumnHeaderIndexCoordinates | null;
}

export interface GridTabIndexState {
  cell: GridCellIndexCoordinates | null;
  columnHeader: GridColumnHeaderIndexCoordinates | null;
}
