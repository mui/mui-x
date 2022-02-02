import { createSelector } from '../../../utils/createSelector';
import { GridStatePro } from '../../../models/gridStatePro';
import { gridColumnLookupSelector } from '../columns';

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
