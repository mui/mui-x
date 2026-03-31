import { gridVisibleRowsSelector } from '../features/pagination/gridPaginationSelector';
import { useGridSelector } from '.';
export const getVisibleRows = (apiRef, 
// TODO: remove after getVisibleRows implementations have been updated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
props) => {
    return gridVisibleRowsSelector(apiRef);
};
/**
 * Computes the list of rows that are reachable by scroll.
 * Depending on whether pagination is enabled, it will return the rows in the current page.
 * - If the pagination is disabled or in server mode, it equals all the visible rows.
 * - If the row tree has several layers, it contains up to `state.pageSize` top level rows and all their descendants.
 * - If the row tree is flat, it only contains up to `state.pageSize` rows.
 */
export const useGridVisibleRows = (apiRef, 
// TODO: remove after useGridVisibleRows implementations have been updated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
props) => {
    return useGridSelector(apiRef, gridVisibleRowsSelector);
};
