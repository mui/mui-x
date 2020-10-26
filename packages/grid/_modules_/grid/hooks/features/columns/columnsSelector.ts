import { createSelector } from 'reselect';
import { Columns, InternalColumns } from '../../../models/colDef/colDef';
import { GridState } from '../core/gridState';

export const columnsSelector = (state: GridState) => state.columns;
export const visibleColumnsSelector = createSelector<GridState, InternalColumns, Columns>(
  columnsSelector,
  (columns: InternalColumns) => columns.visible,
);
export const visibleColumnsLengthSelector = createSelector<GridState, InternalColumns, number>(
  columnsSelector,
  (columns: InternalColumns) => columns.visible.length,
);
export const columnsTotalWidthSelector = createSelector<GridState, InternalColumns, number>(
  columnsSelector,
  (columns: InternalColumns) => columns.meta.totalWidth,
);
