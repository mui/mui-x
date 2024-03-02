import * as React from 'react';
import {
  useGridSelector,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  useGridApiMethod,
  gridDimensionsSelector,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridInfiniteLoaderApi } from './gridInfniteLoaderInterface';

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
  const observer = React.useRef<IntersectionObserver>();
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
      if (observer.current) {
        if (triggerElement.current) {
          observer.current?.unobserve(triggerElement.current);
        }
        // do not observe this node anymore
        triggerElement.current = null;
      }
    }
  });

  const virtualScroller = apiRef.current.virtualScrollerRef.current;
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (!virtualScroller) {
      return;
    }
    if (triggerElement.current) {
      observer.current?.unobserve(triggerElement.current);
    }
    const marginBottom =
      props.scrollEndThreshold - (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);

    observer.current = new IntersectionObserver(handleLoadMoreRows, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${marginBottom}px 0px`,
    });
    if (triggerElement.current) {
      observer.current.observe(triggerElement.current);
    }
  }, [
    virtualScroller,
    props.scrollEndThreshold,
    handleLoadMoreRows,
    isEnabled,
    dimensions.hasScrollX,
    dimensions.scrollbarSize,
  ]);

  const triggerRef = React.useCallback<GridInfiniteLoaderApi['unstable_infiniteLoadingTriggerRef']>(
    (node) => {
      // Prevent the infite loading working in combination with lazy loading
      if (!isEnabled) {
        return;
      }

      if (triggerElement.current !== node) {
        if (triggerElement.current) {
          observer.current?.unobserve(triggerElement.current);
        }

        triggerElement.current = node;
        if (triggerElement.current) {
          observer.current?.observe(triggerElement.current);
        }
      }
    },
    [isEnabled],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_infiniteLoadingTriggerRef: triggerRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
