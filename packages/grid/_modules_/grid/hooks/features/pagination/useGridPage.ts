import * as React from 'react';
import { GridApiRef } from '../../../models';
import {
  useGridLogger,
  useGridSelector,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { GridEvents, GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPageApi, GridPaginationState } from './gridPaginationInterfaces';
import { gridVisibleTopLevelRowCountSelector } from '../filter';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { gridPageSelector } from './gridPaginationSelector';

const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const applyValidPage = (paginationState: GridPaginationState): GridPaginationState => {
  if (!paginationState.pageCount) {
    return paginationState;
  }

  return {
    ...paginationState,
    page: Math.max(Math.min(paginationState.page, paginationState.pageCount - 1), 0),
  };
};

/**
 * @requires useGridPageSize (state, event)
 * @requires useGridFilter (state)
 */
export const useGridPage = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'page' | 'onPageChange' | 'rowCount' | 'initialState'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPage');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    pagination: {
      ...state.pagination!,
      page: props.page ?? props.initialState?.pagination?.page ?? 0,
      pageCount: getPageCount(props.rowCount ?? 0, state.pagination!.pageSize!),
      rowCount: props.rowCount ?? 0,
    },
  }));

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);

  apiRef.current.unstable_updateControlState({
    stateId: 'page',
    propModel: props.page,
    propOnChange: props.onPageChange,
    stateSelector: gridPageSelector,
    changeEvent: GridEvents.pageChange,
  });

  /**
   * API METHODS
   */
  const setPage = React.useCallback(
    (page) => {
      logger.debug(`Setting page to ${page}`);

      apiRef.current.setState((state) => ({
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
        }),
      }));
      apiRef.current.forceUpdate();
    },
    [apiRef, logger],
  );

  const pageApi: GridPageApi = {
    setPage,
  };

  useGridApiMethod(apiRef, pageApi, 'GridPageApi');

  /**
   * EVENTS
   */
  const handlePageSizeChange: GridEventListener<GridEvents.pageSizeChange> = (pageSize) => {
    apiRef.current.setState((state) => {
      const pageCount = getPageCount(state.pagination.rowCount, pageSize);

      return {
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          pageCount,
          page: state.pagination.page,
        }),
      };
    });

    apiRef.current.forceUpdate();
  };

  useGridApiEventHandler(apiRef, GridEvents.pageSizeChange, handlePageSizeChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    apiRef.current.setState((state) => {
      const rowCount = props.rowCount !== undefined ? props.rowCount : visibleTopLevelRowCount;
      const pageCount = getPageCount(rowCount, state.pagination.pageSize);
      const page = props.page == null ? state.pagination.page : props.page;

      return {
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
          rowCount,
          pageCount,
        }),
      };
    });
    apiRef.current.forceUpdate();
  }, [visibleTopLevelRowCount, props.rowCount, props.page, apiRef]);
};
