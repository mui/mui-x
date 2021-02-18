import { createSelector } from 'reselect';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { KeyboardState } from './keyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;
export const gridKeyboardCellSelector = createSelector<
  GridState,
  KeyboardState,
  GridCellIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: KeyboardState) => keyboard.cell);

export const gridKeyboardMultipleKeySelector = createSelector<GridState, KeyboardState, boolean>(
  gridKeyboardStateSelector,
  (keyboard: KeyboardState) => keyboard.isMultipleKeyPressed,
);
