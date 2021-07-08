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
import { GridComponentProps } from '../../../GridComponentProps';

function applyConstraints(state: GridPaginationState): GridPaginationState {
  const pageCount =
    state.pageSize && state.rowCount > 0 ? Math.ceil(state.rowCount / state.pageSize!) : 1;

  return {
    ...state,
    pageCount,
    page: Math.min(pageCount - 1, state.page),
  };
}

export const useGridPagination = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'autoPageSize' | 'rowCount' | 'page' | 'pageSize' | 'onPageChange' | 'onPageSizeChange'
  >,
): void => {
  const logger = useLogger('useGridPagination');

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

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
      propModel: props.page,
      propOnChange: props.onPageChange,
      stateSelector: (state) => state.pagination.page,
      onChangeCallback: (model) => {
        apiRef.current.publishEvent(GRID_PAGE_CHANGE, model);
      },
    });
  }, [apiRef, props.page, props.onPageChange]);

  React.useEffect(() => {
    apiRef.current.updateControlState<number>({
      stateId: 'pageSize',
      propModel: props.pageSize,
      propOnChange: props.onPageSizeChange,
      stateSelector: (state) => state.pagination.pageSize,
      onChangeCallback: (model) => {
        apiRef.current.publishEvent(GRID_PAGE_SIZE_CHANGE, model);
      },
    });
  }, [apiRef, props.pageSize, props.onPageSizeChange]);

  React.useEffect(() => {
    if (props.page === undefined) {
      return;
    }

    setGridState((oldState) => ({
      ...oldState,
      pagination: {
        ...oldState.pagination,
        page: props.page!,
      },
    }));
  }, [setGridState, props.page]);

  React.useEffect(() => {
    if (
      props.pageSize === undefined &&
      (!props.autoPageSize || !containerSizes?.viewportPageSize)
    ) {
      return;
    }

    setGridState((oldState) => {
      return {
        ...oldState,
        pagination: {
          ...oldState.pagination,
          pageSize: props.pageSize ?? containerSizes?.viewportPageSize!,
        },
      };
    });
  }, [setGridState, props.pageSize, containerSizes?.viewportPageSize, props.autoPageSize]);

  React.useEffect(() => {
    setGridState((state) => ({
      ...state,
      pagination: applyConstraints({
        ...state.pagination,
        rowCount: props.rowCount !== undefined ? props.rowCount : visibleRowCount,
      }),
    }));
    forceUpdate();
  }, [
    setGridState,
    forceUpdate,
    visibleRowCount,
    props.rowCount,
    props.autoPageSize,
    props.pageSize,
    props.page,
    containerSizes?.viewportPageSize,
  ]);

  const paginationApi: GridPaginationApi = {
    setPageSize,
    setPage,
  };

  useGridApiMethod(apiRef, paginationApi, 'GridPaginationApi');
};
