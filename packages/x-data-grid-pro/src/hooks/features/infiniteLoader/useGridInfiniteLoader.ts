import * as React from 'react';
import {
  useGridSelector,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  useGridApiMethod,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
import { unstable_useEventCallback } from '@mui/utils';
import { GridRowScrollEndParams } from '../../../models';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridInfiniteLoaderApi } from './gridInfniteLoaderInterface';

class ObserverManager {
  instance?: IntersectionObserver;

  node: HTMLElement | undefined;

  stop() {
    this.instance?.disconnect();
  }

  start() {
    this.stop();
    if (this.node) {
      this.instance?.observe(this.node);
    }
  }

  setNode(newNode?: HTMLElement) {
    this.node = newNode;
  }
}

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
  const observer = React.useRef(new ObserverManager());

  const isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;

  const handleLoadMoreRows = unstable_useEventCallback(([entry]: IntersectionObserverEntry[]) => {
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
        observer.current.stop();
        // do not observe this node anymore
        observer.current.setNode(undefined);
      }
    }
  });

  const virtualScroller = apiRef.current.virtualScrollerRef.current;

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (!virtualScroller) {
      return;
    }
    observer.current.stop();
    observer.current.instance = new IntersectionObserver(handleLoadMoreRows, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${props.scrollEndThreshold}px 0px`,
    });
    observer.current.start();
  }, [virtualScroller, props.scrollEndThreshold, handleLoadMoreRows, isEnabled]);

  const lastVisibleRowRef = React.useCallback<GridInfiniteLoaderApi['unstable_lastVisibleRowRef']>(
    (node) => {
      // Prevent the infite loading working in combination with lazy loading
      if (!isEnabled) {
        return;
      }

      if (observer.current.node !== node) {
        observer.current.setNode(node);
        observer.current.start();
      }
    },
    [isEnabled],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_lastVisibleRowRef: lastVisibleRowRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
