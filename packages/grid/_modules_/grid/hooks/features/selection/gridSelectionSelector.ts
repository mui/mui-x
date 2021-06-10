import { createSelector, OutputSelector } from 'reselect';
import { gridRowsLookupSelector, GridRowsLookup } from '../rows/gridRowsSelector';
import { GridState } from '../core/gridState';
import { GridSelectionState } from './gridSelectionState';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridOptions } from '../../../models/gridOptions';

export const gridSelectionStateSelector = (state: GridState) => state.selection;
export const selectedGridRowsCountSelector: OutputSelector<
  GridState,
  number,
  (res: GridSelectionState, options: GridOptions) => number
> = createSelector<GridState, GridSelectionState, GridOptions, number>(
  gridSelectionStateSelector,
  optionsSelector,
  (selection, options) =>
    options.selectionModel ? options.selectionModel.length : Object.keys(selection).length,
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
