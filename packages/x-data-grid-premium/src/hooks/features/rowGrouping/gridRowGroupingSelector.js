import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { createSelector, createRootSelector, createSelectorMemoized, } from '@mui/x-data-grid-pro/internals';
const gridRowGroupingStateSelector = createRootSelector((state) => state.rowGrouping);
export const gridRowGroupingModelSelector = createSelector(gridRowGroupingStateSelector, (rowGrouping) => rowGrouping.model);
export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(gridRowGroupingModelSelector, gridColumnLookupSelector, (model, columnsLookup) => model.filter((field) => !!columnsLookup[field]));
