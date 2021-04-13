import { createSelector } from 'reselect';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { GridKeyboardState } from './gridKeyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;
export const gridKeyboardCellSelector = createSelector<
  GridState,
  GridKeyboardState,
  GridCellIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.cell);

export const gridKeyboardColumnHeaderSelector = createSelector<
  GridState,
  GridKeyboardState,
  GridColumnHeaderIndexCoordinates | null
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.columnHeader);

export const gridKeyboardMultipleKeySelector = createSelector<
  GridState,
  GridKeyboardState,
  boolean
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.isMultipleKeyPressed);
