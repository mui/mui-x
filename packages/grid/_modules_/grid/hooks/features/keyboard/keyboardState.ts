import { CellIndexCoordinates } from '../../../models/cell';

export interface KeyboardState {
  cell: CellIndexCoordinates | null;
  isMultipleKeyPressed: boolean;
}
