import * as React from 'react';
import { PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { PaginationApi } from '../../../models/api/paginationApi';
import { InternalColumns } from '../../../models/colDef/colDef';
import { PageChangeParams } from '../../../models/params/pageChangeParams';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { useGridReducer } from '../core/useGridReducer';
import { useGridSelector } from '../core/useGridSelector';
import { rowCountSelector } from '../rows/rowsSelector';
import {
  INITIAL_PAGINATION_STATE,
  PaginationActions,
  paginationReducer,
  PaginationState,
  setPageActionCreator,
  setPageSizeActionCreator,
  setPaginationModeActionCreator,
  setRowCountActionCreator,
} from './paginationReducer';

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const usePagination = (
  columns: InternalColumns,
  apiRef: ApiRef,
): PaginationProps => {

  const logger = useLogger('usePagination');

  const {gridState, dispatch} = useGridReducer<PaginationState, PaginationActions>(apiRef, 'pagination', paginationReducer, {...INITIAL_PAGINATION_STATE});
  const options = useGridSelector(apiRef, optionsSelector);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);

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
  useApiEventHandler(apiRef, PAGE_CHANGED, options.onPageChange);
  useApiEventHandler(apiRef, PAGESIZE_CHANGED, options.onPageSizeChange);

  React.useEffect(() => {
    dispatch(setRowCountActionCreator({totalRowCount, apiRef}));
  }, [apiRef, dispatch, totalRowCount]);

  React.useEffect(() => {
    dispatch(setPaginationModeActionCreator({paginationMode: options.paginationMode!, apiRef }));
  }, [apiRef, dispatch, options.paginationMode]);

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
