import * as React from 'react';
import { GridScrollFn, GridScrollParams } from '../../models/params/gridScrollParams';
import { useLogger } from './useLogger';

export function useGridScrollFn(
  renderingZoneElementRef: React.RefObject<HTMLDivElement>,
  columnHeadersElementRef: React.RefObject<HTMLDivElement>,
): [GridScrollFn] {
  const logger = useLogger('useGridScrollFn');
  const previousValue = React.useRef<GridScrollParams>();

  const scrollTo: (v: GridScrollParams) => void = React.useCallback(
    (v) => {
      if (v.left === previousValue.current?.left && v.top === previousValue.current.top) {
        return;
      }

      if (renderingZoneElementRef && renderingZoneElementRef.current) {
        logger.debug(`Moving ${renderingZoneElementRef.current.className} to: ${v.left}-${v.top}`);
        // Force the creation of a layer, avoid paint when changing the transform value.
        renderingZoneElementRef.current!.style.transform = `translate3d(${-v.left}px, ${-v.top}px, 0px)`;
        columnHeadersElementRef.current!.style.transform = `translate3d(${-v.left}px, 0px, 0px)`;
        previousValue.current = v;
      }
    },
    [renderingZoneElementRef, logger, columnHeadersElementRef],
  );

  return [scrollTo];
}
