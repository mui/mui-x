import { createSelector } from 'reselect';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { KeyboardState } from './keyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;
export const gridKeyboardCellSelector = createSelector<
  GridState,
  KeyboardState,
  GridCellIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: KeyboardState) => keyboard.cell);

export const gridKeyboardColumnHeaderSelector = createSelector<
  GridState,
  KeyboardState,
  GridColumnHeaderIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: KeyboardState) => keyboard.columnHeader);

export const gridKeyboardMultipleKeySelector = createSelector<GridState, KeyboardState, boolean>(
  gridKeyboardStateSelector,
  (keyboard: KeyboardState) => keyboard.isMultipleKeyPressed,
);
