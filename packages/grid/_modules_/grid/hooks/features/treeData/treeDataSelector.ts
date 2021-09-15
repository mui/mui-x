import { createSelector } from 'reselect';

import { GridState } from '../core/gridState';

const gridTreeDataStateSelector = (state: GridState) => state.treeData;

export const gridTreeDataExpandedRowsSelector = createSelector(
  gridTreeDataStateSelector,
  (treeData) => treeData.expandedRows,
);
