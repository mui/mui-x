import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const gridRowsStateSelector = (state: GridStateCommunity) => state.rows;

export const gridRowCountSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.totalRowCount,
);

export const gridRowsLoadingSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.loading,
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

export const gridRowGroupingNameSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.groupingName,
);

export const gridRowTreeDepthSelector = createSelector(
  gridRowsStateSelector,
  (rows) => rows.treeDepth,
);

export const gridRowIdsSelector = createSelector(gridRowsStateSelector, (rows) => rows.ids);
