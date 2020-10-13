import * as React from 'react';
import { createSelector } from 'reselect';
import { PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { PaginationApi } from '../../../models/api/paginationApi';
import { InternalColumns } from '../../../models/colDef/colDef';
import { PageChangeParams } from '../../../models/params/pageChangeParams';
import { Rows } from '../../../models/rows';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { GridState } from '../core/gridState';
import { useGridReducer } from '../core/useGridReducer';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { InternalRowsState } from '../core/useRowsReducer';
import {
  INITIAL_PAGINATION_STATE,
  PaginationActions,
  paginationReducer,
  PaginationState,
  setPageActionCreator,
  setPageSizeActionCreator,
  setPageSizeStateUpdate,
  setPageStateUpdate,
  setPaginationModeActionCreator,
  setRowCountActionCreator, setRowCountStateUpdate,
} from './usePaginationReducer';

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

const optionsSelector = (state: GridState)=> state.options; 
const rowsSelector = (state: GridState)=> state.rows;
export const rowCountSelector = createSelector<GridState, InternalRowsState, number>(rowsSelector,
  (rows: InternalRowsState)=> rows && rows.totalRowCount);

export const usePagination = (
  rows: Rows,
  columns: InternalColumns,
  apiRef: ApiRef,
): PaginationProps => {

  const logger = useLogger('usePagination');

  const {gridState, dispatch} = useGridReducer<PaginationState, PaginationActions>(apiRef, 'pagination', paginationReducer, {...INITIAL_PAGINATION_STATE});
  // const [gridState, setGridState, forceUpdate] = useGridState(apiRef)
  const options = useGridSelector(apiRef, optionsSelector);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);

  const setPage = React.useCallback(
    (page: number) => {
      dispatch(setPageActionCreator(page, apiRef));
      //
      // const newState = setPageStateUpdate(gridState.pagination, {page, apiRef});
      // setGridState(oldState=> {
      //   oldState.pagination = newState;
      //   return oldState;
      // })
      // forceUpdate();

    },
    [apiRef, dispatch],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      dispatch(setPageSizeActionCreator(pageSize, apiRef));
      // const newState = setPageSizeStateUpdate(gridState.pagination, {pageSize, apiRef});
      // setGridState(oldState=> {
      //   oldState.pagination = newState;
      //   return oldState;
      // })
      // forceUpdate();

    },
    [apiRef, dispatch],
  );

  const onPageChange = React.useCallback(
    (handler: (param: PageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(PAGE_CHANGED, handler);
    },
    [apiRef],
  );
  const onPageSizeChange = React.useCallback(
    (handler: (param: PageChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(PAGESIZE_CHANGED, handler);
    },
    [apiRef],
  );

  const resetAutopageSize = React.useCallback(() => {
    if (options.autoPageSize) {
      const containerProps = apiRef?.current?.getContainerPropsState();
      const autoPagesize = containerProps?.viewportPageSize;
      if (autoPagesize) {
        logger.debug(`Setting autoPagesize to ${autoPagesize}`);
        setPageSize(autoPagesize);
      }
    }
  }, [options.autoPageSize, apiRef, logger, setPageSize]);

  useApiEventHandler(apiRef, RESIZE, resetAutopageSize);
  useApiEventHandler(apiRef, PAGE_CHANGED, options.onPageChange);
  useApiEventHandler(apiRef, PAGESIZE_CHANGED, options.onPageSizeChange);

  React.useEffect(() => {
    dispatch(setRowCountActionCreator({totalRowCount, apiRef}));

    // const newState = setRowCountStateUpdate(gridState.pagination, {totalRowCount, apiRef});
    // setGridState(oldState=> {
    //   oldState.pagination = newState;
    //   return oldState;
    // })
    // forceUpdate();

  }, [apiRef, dispatch, gridState.pagination, totalRowCount]);

  React.useEffect(() => {
    dispatch(setPaginationModeActionCreator({paginationMode: options.paginationMode!, apiRef }));

    // const newState = {...gridState.pagination, ...{paginationMode: options.paginationMode! }};
    // setGridState(oldState=> {
    //   oldState.pagination = newState;
    //   return oldState;
    // })
    // forceUpdate();

  }, [apiRef, dispatch, gridState.pagination, options.paginationMode]);

  React.useEffect(() => {
    setPage(options.page != null ? options.page : 1);
  }, [options.page, setPage]);

  React.useEffect(() => {
    if (
      !options.autoPageSize &&
      options.pageSize
    ) {
      setPageSize(options.pageSize);
    }
  }, [options.autoPageSize, options.pageSize, logger, setPageSize]);

  React.useEffect(() => {
    if (options.autoPageSize && columns.visible.length > 0) {
      resetAutopageSize();
    }
  }, [options.autoPageSize, resetAutopageSize, columns.visible.length]);

  React.useEffect(() => {
    if (apiRef.current?.isInitialised) {
      apiRef.current.publishEvent(PAGE_CHANGED, gridState.pagination);
    }
  }, [apiRef, apiRef.current.isInitialised, gridState.pagination]);

  const paginationApi: PaginationApi = {
    setPageSize,
    setPage,
    onPageChange,
    onPageSizeChange,
  };

  useApiMethod(apiRef, paginationApi, 'paginationApi');

  return {
    ...gridState.pagination,
    setPage,
    setPageSize,
  };
};
