import { createSelector } from 'reselect';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridState } from '../core/gridState';
import { GridCellIdentifier, GridColIdentifier, GridFocusState, GridTabIndexState } from './gridFocusState';

export const gridFocusStateSelector = (state: GridState) => state.focus;

export const gridFocusCellSelector = createSelector<
  GridState,
  GridFocusState,
  GridCellIdentifier | null
>(gridFocusStateSelector, (focusState: GridFocusState) => focusState.cell);

export const gridFocusColumnHeaderSelector = createSelector<
  GridState,
  GridFocusState,
  GridColIdentifier | null
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
  GridColIdentifier | null
>(gridTabIndexStateSelector, (state: GridTabIndexState) => state.columnHeader);
