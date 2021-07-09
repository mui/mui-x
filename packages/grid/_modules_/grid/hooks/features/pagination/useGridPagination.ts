import * as React from 'react';
import { GRID_PAGE_CHANGE, GRID_PAGE_SIZE_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPaginationApi } from '../../../models/api/gridPaginationApi';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridState } from '../core/useGridState';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { visibleGridRowCountSelector } from '../filter/gridFilterSelector';
import { GridPaginationState } from './gridPaginationState';
import { optionsSelector } from '../../utils/optionsSelector';

function applyConstraints(state: GridPaginationState): GridPaginationState {
  const pageCount =
    state.pageSize && state.rowCount > 0 ? Math.ceil(state.rowCount / state.pageSize!) : 1;

  return {
    ...state,
    pageCount,
    page: Math.min(pageCount - 1, state.page),
  };
}

export const useGridPagination = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridPagination');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((state) => ({
        ...state,
        pagination: applyConstraints({
          ...state.pagination,
          page,
        }),
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      logger.debug(`Setting page size to ${pageSize}`);

      setGridState((state) => ({
        ...state,
        pagination: applyConstraints({
          ...state.pagination,
          pageSize,
        }),
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    apiRef.current.updateControlState<number>({
      stateId: 'page',
      propModel: options.page,
      propOnChange: options.onPageChange,
      stateSelector: (state) => state.pagination.page,
      onChangeCallback: (model) => {
        apiRef.current.publishEvent(GRID_PAGE_CHANGE, model);
      },
    });
  }, [apiRef, options.page, options.onPageChange]);

  React.useEffect(() => {
    apiRef.current.updateControlState<number>({
      stateId: 'pageSize',
      propModel: options.pageSize,
      propOnChange: options.onPageSizeChange,
      stateSelector: (state) => state.pagination.pageSize,
      onChangeCallback: (model) => {
        apiRef.current.publishEvent(GRID_PAGE_SIZE_CHANGE, model);
      },
    });
  }, [apiRef, options.pageSize, options.onPageSizeChange]);

  React.useEffect(() => {
    if (options.page !== undefined) {
      setGridState((oldState) => ({
        ...oldState,
        pagination: {
          ...oldState.pagination,
          page: options.page!,
        },
      }));
    }
  }, [setGridState, options.page]);

  React.useEffect(() => {
    if (options.pageSize !== undefined) {
      setGridState((oldState) => ({
        ...oldState,
        pagination: {
          ...oldState.pagination,
          pageSize: options.pageSize!,
        },
      }));
      forceUpdate();
    }

    if (options.autoPageSize && containerSizes?.viewportPageSize) {
      setGridState((oldState) => {
        return {
          ...oldState,
          pagination: {
            ...oldState.pagination,
            pageSize: containerSizes?.viewportPageSize,
          },
        };
      });
      forceUpdate();
    }
  }, [
    forceUpdate,
    setGridState,
    options.pageSize,
    containerSizes?.viewportPageSize,
    options.autoPageSize,
  ]);

  React.useEffect(() => {
    setGridState((oldState) => ({
      ...oldState,
      pagination: applyConstraints({
        ...oldState.pagination,
        rowCount: options.rowCount !== undefined ? options.rowCount : visibleRowCount,
      }),
    }));
    forceUpdate();
  }, [
    setGridState,
    forceUpdate,
    visibleRowCount,
    options.rowCount,
    // If options.pageSize, options.page, options.autoPageSize or containerSizes?.viewportPageSize changed, we updated the state in the effects above
    // But we did not apply the constraints to avoid updating both page and pageSize in the same state update
    // Therefore we need to apply the constraints now
    options.pageSize,
    options.page,
    options.autoPageSize,
    containerSizes?.viewportPageSize,
  ]);

  const paginationApi: GridPaginationApi = {
    setPageSize,
    setPage,
  };

  useGridApiMethod(apiRef, paginationApi, 'GridPaginationApi');
};
