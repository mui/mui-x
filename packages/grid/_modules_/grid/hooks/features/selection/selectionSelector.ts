import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { SelectionState } from './selectionState';

export const selectionStateSelector = (state: GridState) => state.selection;
export const selectedRowsCountSelector = createSelector<GridState, SelectionState, number>(
  selectionStateSelector,
  (selection) => Object.keys(selection).length,
);
