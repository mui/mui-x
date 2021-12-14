import { createSelector } from 'reselect';
import { GridState } from '../../../models';
import { gridColumnLookupSelector } from '../columns';

export const gridGroupingColumnsStateSelector = (state: GridState) => state.groupingColumns;

export const gridGroupingColumnsModelSelector = createSelector(
  gridGroupingColumnsStateSelector,
  (groupingColumns) => groupingColumns.model,
);

export const gridGroupingColumnsSanitizedModelSelector = createSelector(
  gridGroupingColumnsModelSelector,
  gridColumnLookupSelector,
  (model, columnsLookup) =>
    model.filter((field) => !!columnsLookup[field] && columnsLookup[field].canBeGrouped),
);
