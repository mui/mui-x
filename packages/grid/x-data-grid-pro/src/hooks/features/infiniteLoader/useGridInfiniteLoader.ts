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
    | 'onRowsScrollEnd'
    | 'scrollEndThreshold'
    | 'pagination'
    | 'paginationMode'
    | 'rowsLoadingMode'
    | 'signature'
  >,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const observer = React.useRef<IntersectionObserver>();

  const handleLoadMoreRows = React.useCallback(() => {
    const viewportPageSize = apiRef.current.getViewportPageSize();
    const rowScrollEndParam: GridRowScrollEndParams = {
      visibleColumns,
      viewportPageSize,
      visibleRowsCount: currentPage.rows.length,
    };

    apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParam);
  }, [apiRef, visibleColumns, currentPage.rows.length]);

  const lastVisibleRowRef = React.useCallback<GridInfiniteLoaderApi['unstable_lastVisibleRowRef']>(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(handleLoadMoreRows);

      if (node) {
        observer.current.observe(node);
      }
    },
    [handleLoadMoreRows],
  );

  const infiteLoaderApi: GridInfiniteLoaderApi = {
    unstable_lastVisibleRowRef: lastVisibleRowRef,
  };

  useGridApiMethod(apiRef, infiteLoaderApi, 'public');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
