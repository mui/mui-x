import { createSelector, OutputSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { GridSelectionState } from './gridSelectionState';

export const gridSelectionStateSelector = (state: GridState) => state.selection;
export const selectedGridRowsCountSelector: OutputSelector<
  GridState,
  number,
  (res: GridSelectionState) => number
> = createSelector<GridState, GridSelectionState, number>(
  gridSelectionStateSelector,
  (selection) => Object.keys(selection).length,
);
