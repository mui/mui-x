import { createSelector } from 'reselect';
import { InternalColumns } from '../../../models/colDef/colDef';
import { GridState } from '../../features/core/gridState';

export const columnsSelector = (state: GridState)=> state.columns;
export const columnsTotalWidthSelector = createSelector<GridState, InternalColumns, number>(columnsSelector,	(columns: InternalColumns)=> columns.meta.totalWidth);
