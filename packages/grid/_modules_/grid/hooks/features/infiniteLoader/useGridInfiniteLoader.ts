import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { GridEvents } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { GridComponentProps } from '../../../GridComponentProps';

/**
 * @requires useGridColumns (state)
 * @requires useGridContainerProps (state)
 * @requires useGridVirtualRows (method, event)
 */
export const useGridInfiniteLoader = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'onRowsScrollEnd' | 'scrollEndThreshold'>,
): void => {
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(() => {
    if (!containerSizes) {
      return;
    }

    const scrollPosition = apiRef.current.getScrollPosition();
    const scrollPositionBottom =
      scrollPosition.top + containerSizes.windowSizes.height + props.scrollEndThreshold!;

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
      apiRef.current.publishEvent(GridEvents.rowsScrollEnd, rowScrollEndParam);
      isInScrollBottomArea.current = true;
    }
  }, [props.scrollEndThreshold, containerSizes, apiRef, visibleColumns]);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleGridScroll);
  useGridApiOptionHandler(apiRef, GridEvents.rowsScrollEnd, props.onRowsScrollEnd);
};
