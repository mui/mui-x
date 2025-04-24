import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useGridSelector, useGridApiMethod, gridDimensionsSelector } from '@mui/x-data-grid';
import {
  GridInfiniteLoaderPrivateApi,
  useTimeout,
  gridHorizontalScrollbarHeightSelector,
} from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { styled } from '@mui/system';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

const InfiniteLoadingTriggerElement = styled('div')({
  position: 'sticky',
  left: 0,
  width: 0,
  height: 0,
});

/**
 * @requires useGridDimensions (method) - can be after
 */
export const useGridIntersectionObserver = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'dataSource' | 'lazyLoading' | 'rowsLoadingMode' | 'scrollEndThreshold'
  >,
): void => {
  const isReady = useGridSelector(apiRef, gridDimensionsSelector).isReady;
  const observer = React.useRef<IntersectionObserver>(null);
  const updateTargetTimeout = useTimeout();
  const triggerElement = React.useRef<HTMLElement | null>(null);

  const isEnabledClientSide = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;
  const isEnabledServerSide = props.dataSource && props.lazyLoading;

  const isEnabled = isEnabledClientSide || isEnabledServerSide;

  const handleIntersectionChange = useEventCallback(([entry]: IntersectionObserverEntry[]) => {
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;

    if (isIntersecting && currentRatio === 1) {
      observer.current?.disconnect();
      // do not observe this node anymore
      triggerElement.current = null;
      apiRef.current.publishEvent('rowsScrollEndIntersection');
    }
  });

  React.useEffect(() => {
    const virtualScroller = apiRef.current.virtualScrollerRef.current;
    if (!isEnabled || !isReady || !virtualScroller) {
      return;
    }
    observer.current?.disconnect();

    const horizontalScrollbarHeight = gridHorizontalScrollbarHeightSelector(apiRef);
    const marginBottom = props.scrollEndThreshold - horizontalScrollbarHeight;

    observer.current = new IntersectionObserver(handleIntersectionChange, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${marginBottom}px 0px`,
    });
    if (triggerElement.current) {
      observer.current.observe(triggerElement.current);
    }
  }, [apiRef, isReady, handleIntersectionChange, isEnabled, props.scrollEndThreshold]);

  const updateTarget = (node: HTMLElement | null) => {
    if (triggerElement.current !== node) {
      observer.current?.disconnect();

      triggerElement.current = node;
      if (triggerElement.current) {
        observer.current?.observe(triggerElement.current);
      }
    }
  };

  const triggerRef = React.useCallback(
    (node: HTMLElement | null) => {
      // Prevent the infite loading working in combination with lazy loading
      if (!isEnabled) {
        return;
      }

      // If the user scrolls through the grid too fast it might happen that the observer is connected to the trigger element
      // that will be intersecting the root inside the same render cycle (but not intersecting at the time of the connection).
      // This will cause the observer to not call the callback with `isIntersecting` set to `true`.
      // https://www.w3.org/TR/intersection-observer/#event-loop
      // Delaying the connection to the next cycle helps since the observer will always call the callback the first time it is connected.
      // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe
      // Related to
      // https://github.com/mui/mui-x/issues/14116
      updateTargetTimeout.start(0, () => updateTarget(node));
    },
    [isEnabled, updateTargetTimeout],
  );

  const getInfiniteLoadingTriggerElement = React.useCallback<
    NonNullable<GridInfiniteLoaderPrivateApi['getInfiniteLoadingTriggerElement']>
  >(
    ({ lastRowId }) => {
      if (!isEnabled) {
        return null;
      }
      return (
        <InfiniteLoadingTriggerElement
          ref={triggerRef}
          // Force rerender on last row change to start observing the new trigger
          key={`trigger-${lastRowId}`}
          role="presentation"
        />
      );
    },
    [isEnabled, triggerRef],
  );

  const infiniteLoaderPrivateApi: GridInfiniteLoaderPrivateApi = {
    getInfiniteLoadingTriggerElement,
  };

  useGridApiMethod(apiRef, infiniteLoaderPrivateApi, 'private');
};
