import { GridCellIndexCoordinates } from '../../../models/gridCell';

export interface GridKeyboardState {
  cell: GridCellIndexCoordinates | null;
  isMultipleKeyPressed: boolean;
}
