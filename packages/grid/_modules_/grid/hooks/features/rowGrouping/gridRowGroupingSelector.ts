import { createSelector } from '../../../utils/createSelector';
import { GridState } from '../../../models';
import { gridColumnLookupSelector } from '../columns';

export const gridRowGroupingStateSelector = (state: GridState) => state.rowGrouping;

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
