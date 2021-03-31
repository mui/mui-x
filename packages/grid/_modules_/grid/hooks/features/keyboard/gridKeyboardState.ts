import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';

export interface GridKeyboardState {
  cell: GridCellIndexCoordinates | null;
  columnHeader: GridColumnHeaderIndexCoordinates | null;
  isMultipleKeyPressed: boolean;
}
