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
    (selection) => selection.length,
);

export const selectedGridRowsSelector = createSelector<
    GridState,
    GridSelectionState,
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
    (res: GridSelectionState) => Record<string, GridRowId>
    > = createSelector<GridState, GridSelectionState, Record<string, GridRowId>>(
    gridSelectionStateSelector,
    (selection) =>
        selection.reduce((lookup, rowId) => {
            lookup[rowId] = rowId;
            return lookup;
        }, {}),
);