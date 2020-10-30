import { debounce } from '@material-ui/core/utils';
import * as React from 'react';
import { ScrollFn, ScrollParams } from '../../models/params/scrollParams';
import { useLogger } from './useLogger';
import { useRafUpdate } from './useRafUpdate';

export function useScrollFn(
  apiRef: any,
  renderingZoneElementRef: React.RefObject<HTMLDivElement>,
  columnHeadersElementRef: React.RefObject<HTMLDivElement>,
): [ScrollFn, ScrollFn] {
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
        renderingZoneElementRef.current!.style.transform = `translate(-${v.left}px, -${v.top}px)`;
        columnHeadersElementRef.current!.style.transform = `translate(-${v.left}px, -0px)`;
        debouncedResetPointerEvents();
        previousValue.current = v;
      }
    },
    [renderingZoneElementRef, logger, columnHeadersElementRef, debouncedResetPointerEvents],
  );

  const [runScroll] = useRafUpdate(apiRef, scrollTo);

  React.useEffect(() => {
    return () => {
      debouncedResetPointerEvents.clear();
    };
  }, [renderingZoneElementRef, debouncedResetPointerEvents]);

  return [runScroll, scrollTo];
}
