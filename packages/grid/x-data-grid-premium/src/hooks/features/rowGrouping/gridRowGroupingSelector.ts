import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import {
  createSelectorUnmemoized as createSelector,
  createSelectorMemoized,
} from '@mui/x-data-grid/utils/createSelector';
import { GridStatePremium } from '../../../models/gridStatePremium';

const gridRowGroupingStateSelector = (state: GridStatePremium) => state.rowGrouping;

export const gridRowGroupingModelSelector = createSelector(
  gridRowGroupingStateSelector,
  (rowGrouping) => rowGrouping.model,
);

export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(
  gridRowGroupingModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) =>
    model.filter((field) => !!columnsLookup[field] && columnsLookup[field].groupable),
);
