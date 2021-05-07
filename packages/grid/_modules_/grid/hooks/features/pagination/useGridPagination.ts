import * as React from 'react';
import { GRID_PAGE_CHANGED, GRID_PAGESIZE_CHANGED } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPaginationApi } from '../../../models/api/gridPaginationApi';
import { GridPageChangeParams } from '../../../models/params/gridPageChangeParams';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useGridState } from '../core/useGridState';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridRowCountSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';

function computeState(state) {
  const pageCount =
    state.pageSize && state.rowCount > 0 ? Math.ceil(state.rowCount / state.pageSize!) : 1;

  return {
    ...state,
    pageCount,
    page: Math.min(
      pageCount - 1,
      state.controlledPage !== null ? state.controlledPage : state.page,
    ),
  };
}

export const useGridPagination = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridPagination');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((oldState) => ({
        ...oldState,
        pagination: computeState({
          ...oldState.pagination,
          page,
        }),
      }));
      forceUpdate();

      const params = apiRef.current.getState<GridPaginationState>(
        'pagination',
      ) as GridPageChangeParams;
      apiRef.current.publishEvent(GRID_PAGE_CHANGED, params);
    },
    [apiRef, setGridState, forceUpdate, logger],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      logger.debug(`Setting page size to ${pageSize}`);

      setGridState((oldState) => ({
        ...oldState,
        pagination: computeState({
          ...oldState.pagination,
          pageSize,
        }),
      }));
      forceUpdate();

      const params = apiRef.current.getState<GridPaginationState>(
        'pagination',
      ) as GridPageChangeParams;
      apiRef.current.publishEvent(GRID_PAGESIZE_CHANGED, params);
    },
    [apiRef, setGridState, forceUpdate, logger],
  );

  useGridApiOptionHandler(apiRef, GRID_PAGE_CHANGED, options.onPageChange);
  useGridApiOptionHandler(apiRef, GRID_PAGESIZE_CHANGED, options.onPageSizeChange);

  React.useEffect(() => {
    setGridState((oldState) => ({
      ...oldState,
      pagination: computeState({
        ...oldState.pagination,
        paginationMode:
          options.paginationMode != null
            ? options.paginationMode
            : oldState.pagination.paginationMode,
        controlledPage: options.page !== undefined ? options.page : null,
        rowCount: visibleRowCount,
      }),
    }));
  }, [apiRef, setGridState, options.page, options.paginationMode, visibleRowCount]);

  React.useEffect(() => {
    if (!options.autoPageSize && options.pageSize) {
      setGridState((oldState) => ({
        ...oldState,
        pagination: computeState({
          ...oldState.pagination,
          pageSize: options.pageSize,
        }),
      }));
    } else if (options.autoPageSize && containerSizes && containerSizes?.viewportPageSize > 0) {
      setGridState((oldState) => ({
        ...oldState,
        pagination: computeState({
          ...oldState.pagination,
          pageSize: containerSizes?.viewportPageSize,
        }),
      }));
    }
  }, [setGridState, options.autoPageSize, containerSizes, options.pageSize]);

  const paginationApi: GridPaginationApi = {
    setPageSize,
    setPage,
  };

  useGridApiMethod(apiRef, paginationApi, 'GridPaginationApi');
};
