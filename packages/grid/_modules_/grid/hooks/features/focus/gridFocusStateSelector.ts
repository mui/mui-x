import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import {
  GridCellIdentifier,
  GridColumnIdentifier,
  GridFocusState,
  GridTabIndexState,
} from './gridFocusState';

export const gridFocusStateSelector = (state: GridState) => state.focus;

export const gridFocusCellSelector = createSelector<
  GridState,
  GridFocusState,
  GridCellIdentifier | null
>(gridFocusStateSelector, (focusState: GridFocusState) => focusState.cell);

export const gridFocusColumnHeaderSelector = createSelector<
  GridState,
  GridFocusState,
  GridColumnIdentifier | null
>(gridFocusStateSelector, (focusState: GridFocusState) => focusState.columnHeader);

export const gridTabIndexStateSelector = (state: GridState) => state.tabIndex;

export const gridTabIndexCellSelector = createSelector<
  GridState,
  GridTabIndexState,
  GridCellIdentifier | null
>(gridTabIndexStateSelector, (state: GridTabIndexState) => state.cell);

export const gridTabIndexColumnHeaderSelector = createSelector<
  GridState,
  GridTabIndexState,
  GridColumnIdentifier | null
>(gridTabIndexStateSelector, (state: GridTabIndexState) => state.columnHeader);
