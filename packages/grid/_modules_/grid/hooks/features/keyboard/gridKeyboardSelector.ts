import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridKeyboardState } from './gridKeyboardState';

export const gridKeyboardStateSelector = (state: GridState) => state.keyboard;

export const gridKeyboardMultipleKeySelector = createSelector<
  GridState,
  GridKeyboardState,
  boolean
>(gridKeyboardStateSelector, (keyboard: GridKeyboardState) => keyboard.isMultipleKeyPressed);
