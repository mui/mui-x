import { createSelector } from 'reselect';
import { RowModel } from '../../../models/rows';
import { GridState } from '../core/gridState';
import { sortedRowsSelector } from '../sorting/sortingSelector';
import { FilterState } from './filterState';

export const filterStateSelector = (state: GridState) => state.filter;

export const visibleSortedRowsSelector = createSelector<GridState, FilterState, RowModel[], RowModel[]>(
	filterStateSelector,
	sortedRowsSelector,
(filterState: FilterState, sortedRows: RowModel[])=> {
	const visibleRows = [...sortedRows].filter(row => filterState.hiddenRows.indexOf(row.id) === -1);
	return visibleRows;
});


export const visibleRowCountSelector = createSelector<GridState, RowModel[], number>(visibleSortedRowsSelector, rows=> rows.length )
