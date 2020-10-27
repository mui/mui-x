import * as React from 'react';
import { debounce } from '@material-ui/core/utils';
import { useLogger } from './useLogger';
import { useRafUpdate } from './useRafUpdate';

export interface ScrollParams {
  left: number;
  top: number;
}
export type ScrollFn = (v: ScrollParams) => void;

export function useScrollFn(
  renderingZoneElementRef: React.RefObject<HTMLDivElement>,
  columnHeadersElementRef: React.RefObject<HTMLDivElement>,
): [ScrollFn, ScrollFn] {
  const logger = useLogger('useScrollFn');
  const rafResetPointerRef = React.useRef(0);
  const previousValue = React.useRef<ScrollParams>();
  const [restorePointerEvents] = useRafUpdate(() => {
    if (renderingZoneElementRef && renderingZoneElementRef.current) {
      renderingZoneElementRef.current!.style.pointerEvents = 'unset';
    }
    rafResetPointerRef.current = 0;
  });

  const debouncedResetPointerEvents = React.useMemo(() => debounce(restorePointerEvents, 300), [
    restorePointerEvents,
  ]);

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
        renderingZoneElementRef.current!.style.transform = `translate(-${v.left}px, -${v.top}px)`;
        columnHeadersElementRef.current!.style.transform = `translate(-${v.left}px, -0px)`;
        debouncedResetPointerEvents();
        previousValue.current = v;
      }
    },
    [renderingZoneElementRef, logger, columnHeadersElementRef, debouncedResetPointerEvents],
  );

  const [runScroll] = useRafUpdate(scrollTo);

  React.useEffect(() => {
    return () => {
      debouncedResetPointerEvents.clear();
    };
  }, [renderingZoneElementRef, debouncedResetPointerEvents]);

  return [runScroll, scrollTo];
}
