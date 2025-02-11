import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import {
  createSelector,
  createRootSelector,
  createSelectorMemoized,
} from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

const gridRowGroupingStateSelector = createRootSelector(
  (state: GridStatePremium) => state.rowGrouping,
);

export const gridRowGroupingModelSelector = createSelector(
  gridRowGroupingStateSelector,
  (rowGrouping) => rowGrouping.model,
);

export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(
  gridRowGroupingModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) => model.filter((field) => !!columnsLookup[field]),
);
