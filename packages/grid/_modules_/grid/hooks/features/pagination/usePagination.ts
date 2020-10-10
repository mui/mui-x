import * as React from 'react';
import {useLogger, useRafUpdate} from '../../utils';
import {PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE, ROWS_UPDATED} from '../../../constants/eventsConstants';
import {useApiMethod} from '../../root/useApiMethod';
import {useApiEventHandler} from '../../root/useApiEventHandler';
import {PageChangeParams} from '../../../models/params/pageChangeParams';
import {Rows} from '../../../models/rows';
import {InternalColumns} from '../../../models/colDef/colDef';
import {GridOptions} from '../../../models/gridOptions';
import {PaginationApi} from '../../../models/api/paginationApi';
import {ApiRef} from '../../../models/api';
import {
  getPageCount, INITIAL_PAGINATION_STATE, PaginationActions,
  paginationReducer,
  PaginationState,
  setPageActionCreator,
  setPageSizeActionCreator,
  setPaginationModeActionCreator,
  setRowCountActionCreator
} from "./usePaginationReducer";
import {useGridReducer} from "../core/useGridReducer";
import {createSelector} from "reselect";
import {InternalRowsState} from "../core/useRowsReducer";
import {useGridSelector} from "../core/useGridSelector";
import {GridState} from "../core/useGridApi";
import {useGridState} from "../core/useGridState";

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

  const {state, dispatch} = useGridReducer<PaginationState, PaginationActions>(apiRef, 'pagination', paginationReducer, INITIAL_PAGINATION_STATE);
  const options = useGridSelector(apiRef, optionsSelector);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);
  const [gridState, setGridState ] = useGridState(apiRef);

  React.useEffect(()=> {
    console.log('---------------------- YEHHAHAHHAAHHAHAHAHA -------------------------')
  }, [gridState.options.autoPageSize]);

  const setPage = React.useCallback(
    (page: number) => {
      dispatch(setPageActionCreator(page, apiRef));
    },
    [apiRef, dispatch],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      dispatch(setPageSizeActionCreator(pageSize, apiRef));
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
  // useApiEventHandler(apiRef, PAGE_CHANGED, options.onPageChange);
  // useApiEventHandler(apiRef, PAGESIZE_CHANGED, options.onPageSizeChange);

  React.useEffect(() => {
    dispatch(setRowCountActionCreator({totalRowCount}));
  }, [dispatch, totalRowCount]);

  React.useEffect(() => {
    dispatch(setPaginationModeActionCreator(options.paginationMode!));
  }, [dispatch, options.paginationMode]);

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
      apiRef.current.publishEvent(PAGE_CHANGED, state);
    }
  }, [apiRef, apiRef.current.isInitialised, state]);

  const paginationApi: PaginationApi = {
    setPageSize,
    setPage,
    onPageChange,
    onPageSizeChange,
  };

  useApiMethod(apiRef, paginationApi, 'paginationApi');

  return {
    ...state,
    setPage,
    setPageSize,
  };
};
