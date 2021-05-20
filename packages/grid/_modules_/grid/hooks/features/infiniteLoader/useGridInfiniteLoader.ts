import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import {
  GRID_ROWS_SCROLL,
  GRID_ROWS_SCROLL_END,
  GRID_VIRTUAL_PAGE_CHANGE,
} from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridVirtualPageChangeParams } from '../../../models/params/gridVirtualPageChangeParams';
import { useLogger } from '../../utils/useLogger';

export const useGridInfiniteLoader = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridInfiniteLoader');
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(() => {
    logger.debug('Checking if scroll position reached bottom');

    if (!containerSizes) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();

    // console.log(containerSizes)
    // console.log(scrollPosition.top)

    // const maxScrollHeight = containerSizes!.renderingZoneScrollHeight;

    // const page = lastState.rendering.virtualPage;
    // const nextPage = maxScrollHeight > 0 ? Math.floor(scrollPosition.top / maxScrollHeight) : 0;
    // console.log(`${page} - ${nextPage}`)

    const scrollPositionBottom =
      scrollPosition.top + containerSizes.windowSizes.height + options.scrollEndThreshold;

    if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
      isInScrollBottomArea.current = false;
    }

    if (
      scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
      !isInScrollBottomArea.current &&
      !options.rowCount
    ) {
      const rowScrollEndParam: GridRowScrollEndParams = {
        api: apiRef,
        visibleColumns,
        viewportPageSize: containerSizes.viewportPageSize,
        virtualRowsCount: containerSizes.virtualRowsCount,
      };
      apiRef.current.publishEvent(GRID_ROWS_SCROLL_END, rowScrollEndParam);
      isInScrollBottomArea.current = true;
    }
  }, [logger, options, containerSizes, apiRef, visibleColumns]);

  const handleGridVirtualPageChange = React.useCallback(
    (params: GridVirtualPageChangeParams) => {
      logger.debug('Virtual page changed');

      if (!containerSizes || !options.loadRows) {
        return;
      }

      const state = apiRef.current.getState();
      const newRowsBatchStartIndex = (params.nextPage + 1) * containerSizes.viewportPageSize;
      const toBeLoadedRange: any = [...state.rows.allRows].splice(
        newRowsBatchStartIndex,
        containerSizes.viewportPageSize,
      );

      if (!toBeLoadedRange.includes(null)) {
        return;
      }

      const newRowsBatch = options.loadRows({
        startIndex: newRowsBatchStartIndex,
        viewportPageSize: containerSizes.viewportPageSize,
      });

      if (newRowsBatch.length) {
        apiRef.current.loadRows(
          newRowsBatchStartIndex,
          containerSizes.viewportPageSize,
          newRowsBatch,
        );
      }
    },
    [logger, options, containerSizes, apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiEventHandler(apiRef, GRID_VIRTUAL_PAGE_CHANGE, handleGridVirtualPageChange);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, options.onRowsScrollEnd);
};
