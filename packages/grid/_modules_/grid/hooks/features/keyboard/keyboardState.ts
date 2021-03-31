import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';

export interface KeyboardState {
  cell: GridCellIndexCoordinates | null;
  columnHeader: GridColumnHeaderIndexCoordinates | null;
  isMultipleKeyPressed: boolean;
}
