import { debounce } from '@material-ui/core/utils';
import * as React from 'react';
import { ScrollFn, ScrollParams } from '../../models/params/scrollParams';
import { useLogger } from './useLogger';

export function useScrollFn(
  renderingZoneElementRef: React.RefObject<HTMLDivElement>,
  columnHeadersElementRef: React.RefObject<HTMLDivElement>,
): [ScrollFn] {
  const logger = useLogger('useScrollFn');
  const previousValue = React.useRef<ScrollParams>();

  const debouncedResetPointerEvents = React.useMemo(
    () =>
      debounce(() => {
        renderingZoneElementRef.current!.style.pointerEvents = 'unset';
      }, 300),
    [renderingZoneElementRef],
  );

  const scrollTo: (v: ScrollParams) => void = React.useCallback(
    (v) => {
      if (v.left === previousValue.current?.left && v.top === previousValue.current.top) {
        return;
      }

      if (renderingZoneElementRef && renderingZoneElementRef.current) {
        logger.debug(`Moving ${renderingZoneElementRef.current.className} to: ${v.left}-${v.top}`);
        if (renderingZoneElementRef.current!.style.pointerEvents !== 'none') {
          renderingZoneElementRef.current!.style.pointerEvents = 'none';
        }
        // Force the creation of a layer, avoid paint when changing the transform value.
        renderingZoneElementRef.current!.style.transform = `translate3d(-${v.left}px, -${v.top}px, 0)`;
        columnHeadersElementRef.current!.style.transform = `translate3d(-${v.left}px, 0, 0)`;
        debouncedResetPointerEvents();
        previousValue.current = v;
      }
    },
    [renderingZoneElementRef, logger, columnHeadersElementRef, debouncedResetPointerEvents],
  );

  React.useEffect(() => {
    return () => {
      debouncedResetPointerEvents.clear();
    };
  }, [renderingZoneElementRef, debouncedResetPointerEvents]);

  return [scrollTo];
}
