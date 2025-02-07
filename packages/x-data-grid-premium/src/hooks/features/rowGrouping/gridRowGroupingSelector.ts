import { RefObject } from '@mui/x-internals/types';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { createSelector, createSelectorMemoized } from '@mui/x-data-grid/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';

const gridRowGroupingStateSelector = (apiRef: RefObject<GridApiPremium>) =>
  apiRef.current.state.rowGrouping;

export const gridRowGroupingModelSelector = createSelector(
  gridRowGroupingStateSelector,
  (rowGrouping) => rowGrouping.model,
);

export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(
  gridRowGroupingModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) => model.filter((field) => !!columnsLookup[field]),
);
