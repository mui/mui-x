import * as React from 'react';
import {
  useGridSelector,
  GridEventListener,
  GridScrollParams,
  useGridApiEventHandler,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  gridRowsMetaSelector,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'scrollEndThreshold' | 'pagination' | 'paginationMode' | 'rowsLoadingMode'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const contentHeight = Math.max(rowsMeta.currentPageTotalHeight, 1);

  const isInScrollBottomArea = React.useRef<boolean>(false);

  // Set isInScrollBottomArea to false when new rows are being added,
  // indicating that the scroll position is no longer at the bottom of the content.
  React.useEffect(() => {
    if (isInScrollBottomArea.current) {
      isInScrollBottomArea.current = false;
    }
  }, [currentPage.rows.length, isInScrollBottomArea]);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition: GridScrollParams) => {
      const dimensions = apiRef.current.getRootDimensions();

      // Prevent the infite loading working in combination with lazy loading
      if (!dimensions || props.rowsLoadingMode !== 'client') {
        return;
      }

      const scrollPositionBottom = scrollPosition.top + dimensions.viewportOuterSize.height;
      const viewportPageSize = apiRef.current.getViewportPageSize();

      if (scrollPositionBottom < contentHeight - props.scrollEndThreshold) {
        isInScrollBottomArea.current = false;
      }

      if (
        scrollPositionBottom >= contentHeight - props.scrollEndThreshold &&
        !isInScrollBottomArea.current
      ) {
        const rowScrollEndParam: GridRowScrollEndParams = {
          visibleColumns,
          viewportPageSize,
          visibleRowsCount: currentPage.rows.length,
        };
        apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParam);
        isInScrollBottomArea.current = true;
      }
    },
    [
      contentHeight,
      props.scrollEndThreshold,
      props.rowsLoadingMode,
      visibleColumns,
      apiRef,
      currentPage.rows.length,
    ],
  );

  const handleGridScroll = React.useCallback<GridEventListener<'scrollPositionChange'>>(
    ({ left, top }) => {
      handleRowsScrollEnd({ left, top });
    },
    [handleRowsScrollEnd],
  );

  useGridApiEventHandler(apiRef, 'scrollPositionChange', handleGridScroll);
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
