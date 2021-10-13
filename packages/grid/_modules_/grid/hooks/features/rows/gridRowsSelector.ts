import { createSelector } from 'reselect';
import { GridState } from '../../../models/gridState';

export const gridRowsStateSelector = (state: GridState) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalRowCount,
);

export const gridTopLevelRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalTopLevelRowCount,
);

export const gridRowsLookupSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.idRowsLookup,
);

export const gridRowTreeSelector = createSelector(gridRowsStateSelector, (rows) => rows.tree);

export const gridRowExpandedTreeSelector = createSelector(gridRowTreeSelector, (rowsTree) =>
  Object.fromEntries(
    Object.entries(rowsTree).filter(
      ([, value]) => value.parent == null || rowsTree[value.parent]?.expanded,
    ),
  ),
);

export const gridRowIdsSelector = createSelector(gridRowTreeSelector, (rowsTree) =>
  Object.values(rowsTree).map((node) => node.id),
);
