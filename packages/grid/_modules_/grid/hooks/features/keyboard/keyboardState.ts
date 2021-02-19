import { GridCellIndexCoordinates } from '../../../models/gridCell';

export interface KeyboardState {
  cell: GridCellIndexCoordinates | null;
  isMultipleKeyPressed: boolean;
}
