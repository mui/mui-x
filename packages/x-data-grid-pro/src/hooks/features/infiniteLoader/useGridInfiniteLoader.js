import { useGridEventPriority, gridVisibleColumnDefinitionsSelector, useGridEvent, } from '@mui/x-data-grid';
import { runIf, getVisibleRows } from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (apiRef, props) => {
    const isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;
    const handleLoadMoreRows = useEventCallback(() => {
        const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
        const currentPage = getVisibleRows(apiRef);
        const viewportPageSize = apiRef.current.getViewportPageSize();
        const rowScrollEndParams = {
            visibleColumns,
            viewportPageSize,
            visibleRowsCount: currentPage.rows.length,
        };
        apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
    });
    useGridEventPriority(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
    useGridEvent(apiRef, 'rowsScrollEndIntersection', runIf(isEnabled, handleLoadMoreRows));
};
