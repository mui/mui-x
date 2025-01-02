import * as React from 'react';
import {
  useGridSelector,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  useGridApiMethod,
  gridDimensionsSelector,
} from '@mui/x-data-grid';
import {
  useGridVisibleRows,
  GridInfiniteLoaderPrivateApi,
  useTimeout,
} from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { styled } from '@mui/system';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

const InfiniteLoadingTriggerElement = styled('div')({
  position: 'sticky',
  left: 0,
  width: 0,
  height: 0,
});

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onRowsScrollEnd' | 'pagination' | 'paginationMode' | 'rowsLoadingMode' | 'scrollEndThreshold'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const observer = React.useRef<IntersectionObserver>(null);
  const updateTargetTimeout = useTimeout();
  const triggerElement = React.useRef<HTMLElement | null>(null);

  const isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;

  const handleLoadMoreRows = useEventCallback(([entry]: IntersectionObserverEntry[]) => {
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;

    if (isIntersecting && currentRatio === 1) {
      const viewportPageSize = apiRef.current.getViewportPageSize();
      const rowScrollEndParams: GridRowScrollEndParams = {
        visibleColumns,
        viewportPageSize,
        visibleRowsCount: currentPage.rows.length,
      };
      apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
      observer.current?.disconnect();
      // do not observe this node anymore
      triggerElement.current = null;
    }
  });

  const virtualScroller = apiRef.current.virtualScrollerRef.current;
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

  const marginBottom =
    props.scrollEndThreshold - (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (!virtualScroller) {
      return;
    }
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(handleLoadMoreRows, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${marginBottom}px 0px`,
    });
    if (triggerElement.current) {
      observer.current.observe(triggerElement.current);
    }
  }, [virtualScroller, handleLoadMoreRows, isEnabled, marginBottom]);

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
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
