import { createSelector } from 'reselect';
import { CellIndexCoordinates } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { KeyboardState } from './keyboardState';

export const keyboardStateSelector = (state: GridState) => state.keyboard;
export const keyboardCellSelector = createSelector<
  GridState,
  KeyboardState,
  CellIndexCoordinates | null
>(keyboardStateSelector, (keyboard: KeyboardState) => keyboard.cell);
