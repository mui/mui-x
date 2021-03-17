import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { GRID_ROWS_SCROLL, GRID_ROWS_SCROLL_END } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridScrollParams } from '../../../models/params/gridScrollParams';

export const useGridInfiniteLoader = (apiRef: GridApiRef): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const getRealScroll = React.useCallback(
    (): GridScrollParams => apiRef.current.getState().rendering.realScroll,
    [apiRef],
  );

  const handleGridScroll = React.useCallback(() => {
    if (!containerSizes) {
      return;
    }

    const realScroll = getRealScroll();
    const scrollPositionBottom =
      realScroll.top + containerSizes.windowSizes.height + options.scrollEndThreshold;

    if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
      isInScrollBottomArea.current = false;
    }

    if (
      scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
      !isInScrollBottomArea.current
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
  }, [options, containerSizes, apiRef, visibleColumns, getRealScroll]);

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL_END, options.onRowsScrollEnd);
};
