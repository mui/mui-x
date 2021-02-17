import { createSelector } from 'reselect';
import { CellIndexCoordinates } from '../../../models/cell';
import { GridState } from '../core/gridState';
import { KeyboardState } from './keyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;
export const gridKeyboardCellSelector = createSelector<
  GridState,
  KeyboardState,
  CellIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: KeyboardState) => keyboard.cell);

export const gridKeyboardMultipleKeySelector = createSelector<GridState, KeyboardState, boolean>(
  gridKeyboardStateSelector,
  (keyboard: KeyboardState) => keyboard.isMultipleKeyPressed,
);
