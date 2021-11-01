import * as React from 'react';
import { GridApiRef } from '../../../models';
import {
  useGridLogger,
  useGridSelector,
  useGridState,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridPageApi } from '../../../models/api/gridPageApi';
import { GridPaginationState } from './gridPaginationState';
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
 * @requires useGridControlState (method)
 * @requires useGridPageSize (state, event)
 * @requires useGridFilter (state)
 */
export const useGridPage = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'page' | 'onPageChange' | 'rowCount'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridPage');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    pagination: {
      ...state.pagination!,
      page: 0,
      pageCount: getPageCount(props.rowCount ?? 0, state.pagination!.pageSize!),
      rowCount: props.rowCount ?? 0,
    },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);

  apiRef.current.unsafe_updateControlState({
    stateId: 'page',
    propModel: props.page,
    propOnChange: props.onPageChange,
    stateSelector: gridPageSelector,
    changeEvent: GridEvents.pageChange,
  });

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);

      setGridState((state) => ({
        ...state,
        pagination: applyValidPage({
          ...state.pagination,
          page,
        }),
      }));
      forceUpdate();
    },
    [setGridState, forceUpdate, logger],
  );

  React.useEffect(() => {
    setGridState((state) => {
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
    forceUpdate();
  }, [setGridState, forceUpdate, visibleTopLevelRowCount, props.rowCount, props.page, apiRef]);

  const handlePageSizeChange = React.useCallback(
    (pageSize: number) => {
      setGridState((state) => {
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

      forceUpdate();
    },
    [setGridState, forceUpdate],
  );

  useGridApiEventHandler(apiRef, GridEvents.pageSizeChange, handlePageSizeChange);

  const pageApi: GridPageApi = {
    setPage,
  };

  useGridApiMethod(apiRef, pageApi, 'GridPageApi');
};
