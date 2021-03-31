import { createSelector } from 'reselect';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { GridKeyboardState } from './gridKeyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;
export const gridKeyboardCellSelector = createSelector<
  GridState,
  GridKeyboardState,
  GridCellIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.cell);

export const gridKeyboardMultipleKeySelector = createSelector<
  GridState,
  GridKeyboardState,
  boolean
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.isMultipleKeyPressed);
