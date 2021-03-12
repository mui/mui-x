import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { GRID_NATIVE_SCROLL, GRID_ROWS_SCROLL_END } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridRowScrollEndParams } from '../../../models/params/gridRowScrollEndParams';
import { visibleGridColumnsSelector } from '../columns/gridColumnsSelector';

export const useGridInfiniteLoader = (
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: GridApiRef,
): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(
    (event) => {
      const scrollPositionBottom =
        event.target.scrollTop + containerSizes?.windowSizes.height + options.scrollEndThreshold;

      if (containerSizes && scrollPositionBottom >= containerSizes.dataContainerSizes.height) {
        if (!isInScrollBottomArea.current) {
          const rowScrollEndParam: GridRowScrollEndParams = {
            api: apiRef,
            visibleColumns,
            viewportPageSize: containerSizes?.viewportPageSize,
            virtualRowsCount: containerSizes?.virtualRowsCount,
          };
          apiRef.current.publishEvent(GRID_ROWS_SCROLL_END, rowScrollEndParam);
          isInScrollBottomArea.current = true;
        }
      } else {
        isInScrollBottomArea.current = false;
      }
    },
    [options, containerSizes, apiRef, visibleColumns],
  );

  useNativeEventListener(apiRef, windowRef, GRID_NATIVE_SCROLL, handleGridScroll, {
    passive: true,
  });
  useGridApiEventHandler(apiRef, GRID_ROWS_SCROLL_END, options.onRowsScrollEnd);
};
