import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../../utils/useGridSelector';
import { GridEvents } from '../../../constants/eventsConstants';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridScrollParams } from '../../../models/params/gridScrollParams';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';

/**
 * Only available in DataGridPro
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'onRowsScrollEnd' | 'scrollEndThreshold' | 'pagination' | 'paginationMode'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const currentPage = useCurrentPageRows(apiRef, props);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const contentHeight = Math.max(currentPage.rows.length * rowHeight, 1);

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

  const handleGridScroll = React.useCallback(
    ({ left, top }) => {
      handleRowsScrollEnd({ left, top });
    },
    [handleRowsScrollEnd],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleGridScroll);
  useGridApiOptionHandler(apiRef, GridEvents.rowsScrollEnd, props.onRowsScrollEnd);
};
