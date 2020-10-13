import { createSelector } from 'reselect';
import { GridState } from '../core/gridState';
import { InternalRowsState } from './rowsReducer';

export const rowsSelector = (state: GridState) => state.rows;
export const rowCountSelector = createSelector<GridState, InternalRowsState, number>(rowsSelector,
	(rows: InternalRowsState) => rows && rows.totalRowCount);
