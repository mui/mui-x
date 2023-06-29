import * as React from 'react';
import {
  useGridSelector,
  useGridApiOptionHandler,
  gridVisibleColumnDefinitionsSelector,
  useGridApiMethod,
} from '@mui/x-data-grid';
import { useGridVisibleRows } from '@mui/x-data-grid/internals';
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
    'onRowsScrollEnd' | 'scrollEndThreshold' | 'pagination' | 'paginationMode' | 'rowsLoadingMode'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const observer = React.useRef<IntersectionObserver>();
  let previousY = 0;
  let previousRatio = 0;

  const handleLoadMoreRows = React.useCallback(
    ([entry]: any) => {
      const currentY = entry.boundingClientRect.y;
      const currentRatio = entry.intersectionRatio;
      const isIntersecting = entry.isIntersecting;

      // Scrolling down check
      if (currentY < previousY || isIntersecting) {
        if (currentRatio > previousRatio) {
          const viewportPageSize = apiRef.current.getViewportPageSize();
          const rowScrollEndParam: GridRowScrollEndParams = {
            visibleColumns,
            viewportPageSize,
            visibleRowsCount: currentPage.rows.length,
          };
          apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParam);
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      previousY = currentY;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      previousRatio = currentRatio;
    },
    [apiRef, visibleColumns, currentPage.rows.length],
  );

  const lastVisibleRowRef = React.useCallback<GridInfiniteLoaderApi['unstable_lastVisibleRowRef']>(
    (node) => {
      // Prevent the infite loading working in combination with lazy loading
      if (props.rowsLoadingMode !== 'client') {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(handleLoadMoreRows, {
        threshold: props.scrollEndThreshold,
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [props, handleLoadMoreRows],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_lastVisibleRowRef: lastVisibleRowRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
