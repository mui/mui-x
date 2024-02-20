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
    this.isActive = false;
    this.instance?.disconnect();
  }

  start() {
    if (this.isActive) {
      this.stop();
    }
    this.isActive = true;
    if (this.node) {
      this.instance?.observe(this.node);
    }
  }

  setNode(newNode: HTMLElement) {
    this.node = newNode;
  }

  isActive = true;
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
  const previousY = React.useRef<number | null>(null);

  const handleLoadMoreRows = unstable_useEventCallback(([entry]: IntersectionObserverEntry[]) => {
    const currentY = entry.intersectionRect.y;
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;

    // Scrolling down check
    if (
      isIntersecting &&
      currentRatio === 1 &&
      (!previousY.current || currentY < previousY.current)
    ) {
      const viewportPageSize = apiRef.current.getViewportPageSize();
      const rowScrollEndParams: GridRowScrollEndParams = {
        visibleColumns,
        viewportPageSize,
        visibleRowsCount: currentPage.rows.length,
      };
      apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
      if (observer.current) {
        observer.current.stop();
        apiRef.current.eventManager.once('rowsSet', () => {
          observer.current?.start();
        });
      }
    }

    previousY.current = currentY;
  });

  const virtualScroller = apiRef.current.virtualScrollerRef.current;

  React.useEffect(() => {
    if (!virtualScroller) {
      return;
    }
    observer.current.instance?.disconnect();
    observer.current.instance = new IntersectionObserver(handleLoadMoreRows, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${props.scrollEndThreshold}px 0px`,
    });
    if (observer.current.isActive) {
      observer.current.start();
    }
  }, [virtualScroller, props.scrollEndThreshold, handleLoadMoreRows]);

  const hasOnRowsScrollEnd = !!props.onRowsScrollEnd;
  const lastVisibleRowRef = React.useCallback<GridInfiniteLoaderApi['unstable_lastVisibleRowRef']>(
    (node) => {
      // Prevent the infite loading working in combination with lazy loading
      if (props.rowsLoadingMode !== 'client' || !hasOnRowsScrollEnd) {
        return;
      }

      if (observer.current.node !== node) {
        observer.current.setNode(node);
        previousY.current = null;
        if (node && observer.current.isActive) {
          observer.current.start();
        }
      }
    },
    [props.rowsLoadingMode, hasOnRowsScrollEnd],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_lastVisibleRowRef: lastVisibleRowRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
