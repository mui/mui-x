import * as React from 'react';
import { useLogger } from './useLogger';
import { debounce } from '../../utils/utils';
import { useRafUpdate } from './useRafUpdate';

export interface ScrollParams {
  left: number;
  top: number;
}
export type ScrollFn = (v: ScrollParams) => void;

export function useScrollFn(
  scrollingElementRef: React.RefObject<HTMLDivElement>,
  onScroll?: ScrollFn,
): [ScrollFn, ScrollFn] {
  const logger = useLogger('useScrollFn');
  const rafRef = React.useRef(0);
  const rafResetPointerRef = React.useRef(0);
  const previousValue = React.useRef<ScrollParams>();
  const [restorePointerEvents] = useRafUpdate(() => {
    if (scrollingElementRef && scrollingElementRef.current) {
      scrollingElementRef.current!.style.pointerEvents = 'unset';
    }
    rafResetPointerRef.current = 0;
  });

  const debouncedResetPointerEvents = React.useMemo(() => debounce(restorePointerEvents, 300), [
    restorePointerEvents,
  ]) as any;

  const scrollTo: (v: ScrollParams) => void = React.useCallback(
    (v) => {
      if (v.left === previousValue.current?.left && v.top === previousValue.current.top) {
        return;
      }

      if (scrollingElementRef && scrollingElementRef.current) {
        rafRef.current = 0;
        logger.debug(`Moving ${scrollingElementRef.current.className} to: ${v.left}-${v.top}`);
        if (scrollingElementRef.current!.style.pointerEvents !== 'none') {
          scrollingElementRef.current!.style.pointerEvents = 'none';
        }
        scrollingElementRef.current!.style.transform = `translate(-${v.left}px, -${v.top}px)`;
        debouncedResetPointerEvents();
        previousValue.current = v;

        if (onScroll) {
          onScroll(v);
        }
      }
    },
    [scrollingElementRef, debouncedResetPointerEvents, logger, onScroll],
  );

  const [runScroll] = useRafUpdate(scrollTo);

  React.useEffect(() => {
    return () => {
      debouncedResetPointerEvents.cancel();
    };
  }, [scrollingElementRef, debouncedResetPointerEvents]);

  return [runScroll, scrollTo];
}
