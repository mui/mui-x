import { createSelector, OutputSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { SelectionState } from './selectionState';

export const selectionStateSelector = (state: GridState) => state.selection;
export const selectedRowsCountSelector: OutputSelector<
  GridState,
  number,
  (res: SelectionState) => number
> = createSelector<GridState, SelectionState, number>(
  selectionStateSelector,
  (selection) => Object.keys(selection).length,
);
