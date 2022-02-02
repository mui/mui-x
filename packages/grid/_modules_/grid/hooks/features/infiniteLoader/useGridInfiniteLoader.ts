import * as React from 'react';
import { GridApiPro } from '../../../models/api/gridApiPro';
import { useGridSelector } from '../../utils/useGridSelector';
import { GridEvents, GridEventListener } from '../../../models/events';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';

/**
 * Only available in DataGridPro
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'scrollEndThreshold' | 'pagination' | 'paginationMode'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const currentPage = useCurrentPageRows(apiRef, props);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const contentHeight = Math.max(rowsMeta.currentPageTotalHeight, 1);

  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleRowsScrollEnd = React.useCallback(
    (scrollPosition: GridScrollParams) => {
      const dimensions = apiRef.current.getRootDimensions();
      if (!dimensions) {
        return;
      }

      const scrollPositionBottom = scrollPosition.top + dimensions.viewportOuterSize.height;
      const viewportPageSize = apiRef.current.unstable_getViewportPageSize();

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
          virtualRowsCount: currentPage.rows.length,
        };
        apiRef.current.publishEvent(GridEvents.rowsScrollEnd, rowScrollEndParam);
        isInScrollBottomArea.current = true;
      }
    },
    [contentHeight, props.scrollEndThreshold, visibleColumns, apiRef, currentPage.rows.length],
  );

  const handleGridScroll = React.useCallback<GridEventListener<GridEvents.rowsScroll>>(
    ({ left, top }) => {
      handleRowsScrollEnd({ left, top });
    },
    [handleRowsScrollEnd],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleGridScroll);
  useGridApiOptionHandler(apiRef, GridEvents.rowsScrollEnd, props.onRowsScrollEnd);
};
