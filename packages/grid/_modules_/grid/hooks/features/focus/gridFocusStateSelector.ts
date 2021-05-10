import { createSelector } from 'reselect';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { GridFocusState, GridTabIndexState } from './gridFocusState';

export const gridFocusStateSelector = (state: GridState) => state.focus;

export const gridFocusCellSelector = createSelector<
  GridState,
  GridFocusState,
  GridCellIndexCoordinates | null
>(gridFocusStateSelector, (focusState: GridFocusState) => focusState.cell);

export const gridFocusColumnHeaderSelector = createSelector<
  GridState,
  GridFocusState,
  GridColumnHeaderIndexCoordinates | null
>(gridFocusStateSelector, (focusState: GridFocusState) => focusState.columnHeader);

export const gridTabIndexStateSelector = (state: GridState) => state.tabIndex;

export const gridTabIndexCellSelector = createSelector<
  GridState,
  GridTabIndexState,
  GridCellIndexCoordinates | null
>(gridTabIndexStateSelector, (state: GridTabIndexState) => state.cell);

export const gridTabIndexColumnHeaderSelector = createSelector<
  GridState,
  GridTabIndexState,
  GridColumnHeaderIndexCoordinates | null
>(gridTabIndexStateSelector, (state: GridTabIndexState) => state.columnHeader);
