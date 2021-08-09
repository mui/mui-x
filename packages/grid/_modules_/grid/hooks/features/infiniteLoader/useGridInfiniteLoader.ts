import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { GRID_ROWS_SCROLL, GRID_ROWS_SCROLL_END } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridComponentProps } from '../../../GridComponentProps';

export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onRowsScrollEnd'>,
): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(() => {
    if (!containerSizes) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();
    const scrollPositionBottom =
      scrollPosition.top + containerSizes.windowSizes.height + options.scrollEndThreshold;

    if (scrollPositionBottom < containerSizes.dataContainerSizes.height) {
      isInScrollBottomArea.current = false;
    }

    if (
      scrollPositionBottom >= containerSizes.dataContainerSizes.height &&
      !isInScrollBottomArea.current
    ) {
      const rowScrollEndParam: GridRowScrollEndParams = {
        visibleColumns,
        viewportPageSize: containerSizes.viewportPageSize,
        virtualRowsCount: containerSizes.virtualRowsCount,
      };
      apiRef.current.publishEvent(GRID_ROWS_SCROLL_END, rowScrollEndParam);
      isInScrollBottomArea.current = true;
    }
  }, [options, containerSizes, apiRef, visibleColumns]);

  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL, handleGridScroll);
  useGridApiOptionHandler(apiRef, GRID_ROWS_SCROLL_END, props.onRowsScrollEnd);
};
