import {
  gridColumnLookupSelector,
  unstable_createSelector as createSelector,
} from '@mui/x-data-grid';
import { GridStatePro } from '../../../models/gridStatePro';

export const gridRowGroupingStateSelector = (state: GridStatePro) => state.rowGrouping;

export const gridRowGroupingModelSelector = createSelector(
  gridRowGroupingStateSelector,
  (rowGrouping) => rowGrouping.model,
);

export const gridRowGroupingSanitizedModelSelector = createSelector(
  gridRowGroupingModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) =>
    model.filter((field) => !!columnsLookup[field] && columnsLookup[field].groupable),
);
