import * as React from 'react';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridSelector } from '../core/useGridSelector';
import { useNativeEventListener } from '../../root/useNativeEventListener';
import { GRID_SCROLL } from '../../../constants/eventsConstants';
import { gridContainerSizesSelector } from '../../utils/sizesSelector';

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
        event.target.scrollTop + containerSizes?.windowSizes.height + options.scrollBottomThreshold;

      if (containerSizes && scrollPositionBottom >= containerSizes.dataContainerSizes.height) {
        if (!isInScrollBottomArea.current && options.onScrollBottom) {
          isInScrollBottomArea.current = true;
          options.onScrollBottom();
        }
      } else {
        isInScrollBottomArea.current = false;
      }
    },
    [options, containerSizes],
  );

  useNativeEventListener(apiRef, windowRef, GRID_SCROLL, handleGridScroll, { passive: true });
};
