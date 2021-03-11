import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { GRID_SCROLL, GRID_SCROLL_ROW_END } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../utils/gridContainerSizesSelector';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';

export const useGridInfiniteLoader = (
  windowRef: React.MutableRefObject<HTMLDivElement | null>,
  apiRef: GridApiRef,
): void => {
  const options = useGridSelector(apiRef, optionsSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const isInScrollBottomArea = React.useRef<boolean>(false);

  const handleGridScroll = React.useCallback(
    (event) => {
      const scrollPositionBottom =
        event.target.scrollTop +
        containerSizes?.windowSizes.height +
        options.scrollEndThresholdHeight;

      if (containerSizes && scrollPositionBottom >= containerSizes.dataContainerSizes.height) {
        if (!isInScrollBottomArea.current) {
          isInScrollBottomArea.current = true;
          apiRef.current.publishEvent(GRID_SCROLL_ROW_END, event);
        }
      } else {
        isInScrollBottomArea.current = false;
      }
    },
    [options, containerSizes, apiRef],
  );

  useNativeEventListener(apiRef, windowRef, GRID_SCROLL, handleGridScroll, { passive: true });
  useGridApiEventHandler(apiRef, GRID_SCROLL_ROW_END, options.onRowsScrollEnd);
};
