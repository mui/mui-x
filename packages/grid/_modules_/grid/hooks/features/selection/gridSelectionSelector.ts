import { createSelector, OutputSelector } from 'reselect';
import { gridRowsLookupSelector, GridRowsLookup } from '../rows/gridRowsSelector';
import { GridState } from '../core/gridState';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { GridSelectionModel } from '../../../models/gridSelectionModel';

export const gridSelectionStateSelector = (state: GridState) => state.selection;
export const selectedGridRowsCountSelector: OutputSelector<
  GridState,
  number,
  (res: GridSelectionModel) => number
> = createSelector<GridState, GridSelectionModel, number>(
  gridSelectionStateSelector,
  (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelector<
  GridState,
  GridSelectionModel,
  GridRowsLookup,
  Map<GridRowId, GridRowModel>
>(
  gridSelectionStateSelector,
  gridRowsLookupSelector,
  (selectedRows, rowsLookup) => new Map(selectedRows.map((id) => [id, rowsLookup[id]])),
);

export const selectedIdsLookupSelector: OutputSelector<
  GridState,
  Record<string, GridRowId>,
  (res: GridSelectionModel) => Record<string, GridRowId>
> = createSelector<GridState, GridSelectionModel, Record<string, GridRowId>>(
  gridSelectionStateSelector,
  (selection) =>
    selection.reduce((lookup, rowId) => {
      lookup[rowId] = rowId;
      return lookup;
    }, {}),
);
