import { createSelector, OutputSelector } from 'reselect';
import { gridRowsLookupSelector, GridRowsLookup } from '../rows/gridRowsSelector';
import { GridState } from '../core/gridState';
import { GridSelectionState } from './gridSelectionState';
import { GridRowId, GridRowModel } from '../../../models/gridRows';

export const gridSelectionStateSelector = (state: GridState) => state.selection;
export const selectedGridRowsCountSelector: OutputSelector<
  GridState,
  number,
  (res: GridSelectionState) => number
> = createSelector<GridState, GridSelectionState, number>(
  gridSelectionStateSelector,
  (selection) => Object.keys(selection).length,
);

export const selectedGridRowsSelector = createSelector<
  GridState,
  GridSelectionState,
  GridRowsLookup,
  Map<GridRowId, GridRowModel>
>(
  gridSelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) =>
    new Map(Object.values(selectedRows).map((id) => [id, rowsLookup[id]])),
);
