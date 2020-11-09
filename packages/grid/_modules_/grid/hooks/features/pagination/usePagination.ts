import * as React from 'react';
import { PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { PaginationApi } from '../../../models/api/paginationApi';
import { PaginationProps } from '../../../models/paginationProps';
import { PageChangeParams } from '../../../models/params/pageChangeParams';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { visibleColumnsLengthSelector } from '../columns/columnsSelector';
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

const PAGINATION_STATE_ID = 'pagination';

export const usePagination = (apiRef: ApiRef): PaginationProps => {
  const logger = useLogger('usePagination');

  const { gridState, dispatch } = useGridReducer<PaginationState, PaginationActions>(
    apiRef,
    PAGINATION_STATE_ID,
    paginationReducer,
    { ...INITIAL_PAGINATION_STATE },
  );
  const options = useGridSelector(apiRef, optionsSelector);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);
  const visibleColumnsLength = useGridSelector(apiRef, visibleColumnsLengthSelector);

  const setPage = React.useCallback(
    (page: number) => {
      logger.debug(`Setting page to ${page}`);
      dispatch(setPageActionCreator(page));

      // we use getState here to avoid adding a dependency on gridState as a dispatch change the state, it would change this method and create an infinite loop
      const params: PageChangeParams = apiRef.current.getState<PaginationState>(
        PAGINATION_STATE_ID,
      ) as PageChangeParams;
      apiRef.current.publishEvent(PAGE_CHANGED, params);
    },
    [apiRef, dispatch, logger],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      dispatch(setPageSizeActionCreator(pageSize));
      apiRef.current.publishEvent(
        PAGESIZE_CHANGED,
        apiRef.current.getState<PaginationState>(PAGINATION_STATE_ID) as PageChangeParams,
      );
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
    dispatch(setRowCountActionCreator({ totalRowCount }));
  }, [apiRef, dispatch, totalRowCount]);

  React.useEffect(() => {
    dispatch(setPaginationModeActionCreator({ paginationMode: options.paginationMode! }));
  }, [apiRef, dispatch, options.paginationMode]);

  React.useEffect(() => {
    setPage(options.page != null ? options.page : 1);
  }, [options.page, setPage]);

  React.useEffect(() => {
    if (!options.autoPageSize && options.pageSize) {
      setPageSize(options.pageSize);
    }
  }, [options.autoPageSize, options.pageSize, logger, setPageSize]);

  React.useEffect(() => {
    if (options.autoPageSize && visibleColumnsLength > 0) {
      resetAutopageSize();
    }
  }, [options.autoPageSize, resetAutopageSize, visibleColumnsLength]);

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
