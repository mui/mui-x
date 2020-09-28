import * as React from 'react';
import { useLogger } from '../utils';
import { PAGE_CHANGED, PAGESIZE_CHANGED, RESIZE } from '../../constants/eventsConstants';
import { useApiMethod } from '../root/useApiMethod';
import { useApiEventHandler } from '../root/useApiEventHandler';
import { PageChangeParams } from '../../models/params/pageChangeParams';
import { Rows } from '../../models/rows';
import { InternalColumns } from '../../models/colDef/colDef';
import { GridOptions } from '../../models/gridOptions';
import { PaginationApi } from '../../models/api/paginationApi';
import { ApiRef } from '../../models/api';
import { FeatureModeConstant } from '../../models/featureMode';

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}
export type PaginationState = PageChangeParams;
const UPDATE_STATE_ACTION = 'updateState';

function updateStateAction(
  state: Partial<PaginationState>,
): { type: 'updateState'; payload: Partial<PaginationState> } {
  return { type: UPDATE_STATE_ACTION, payload: state };
}

function paginationReducer(
  state: PaginationState,
  action: { type: string; payload?: Partial<PaginationState> },
) {
  if (action.type === UPDATE_STATE_ACTION) {
    return { ...state, ...action.payload };
  }
  throw new Error(`Material-UI: Action ${action.type} not found.`);
}

const getPageCount = (pageSize: number | undefined, rowsCount: number) => {
  return pageSize && rowsCount > 0 ? Math.ceil(rowsCount / pageSize!) : 1;
};

export const usePagination = (
  rows: Rows,
  columns: InternalColumns,
  options: GridOptions,
  apiRef: ApiRef,
): PaginationProps => {
  const logger = useLogger('usePagination');

  const initialState: PaginationState = {
    paginationMode: options.paginationMode!,
    pageSize: options.pageSize || 0,
    rowCount: options.rowCount == null ? rows.length : options.rowCount,
    page: options.page || 1,
    pageCount: getPageCount(
      options.pageSize,
      options.rowCount == null ? rows.length : options.rowCount,
    ),
  };
  const stateRef = React.useRef(initialState);
  const prevPageRef = React.useRef<number>(1);
  const [state, dispatch] = React.useReducer(paginationReducer, initialState);

  const updateState = React.useCallback((stateUpdate: Partial<PaginationState>) => {
    const newState = { ...stateRef.current, ...stateUpdate };
    stateRef.current = newState;
    dispatch(updateStateAction(newState));
  }, []);

  const setPage = React.useCallback(
    (page: number) => {
      let hasPageChanged = false;
      if (stateRef.current.rowCount > 0) {
        page = stateRef.current.pageCount >= page ? page : stateRef.current.pageCount;
        apiRef.current.renderPage(
          stateRef.current.paginationMode === FeatureModeConstant.client ? page : 1,
        );
        hasPageChanged = true;
      }
      const params: PageChangeParams = {
        ...stateRef.current,
        page,
      };
      if (hasPageChanged && prevPageRef.current !== page) {
        apiRef.current.publishEvent(PAGE_CHANGED, params);
        prevPageRef.current = page;
      }
      if (stateRef.current.page !== page) {
        updateState({ page });
      }
    },
    [updateState, apiRef],
  );

  // We use stateRef in this method to avoid reattaching this method to the api every time the state changes
  const setPageSize = React.useCallback(
    (pageSize: number) => {
      if (stateRef.current.pageSize === pageSize) {
        return;
      }

      const oldPageSize = stateRef.current.pageSize;
      const newPageCount = getPageCount(pageSize, stateRef.current.rowCount);
      const firstRowIdx = (stateRef.current.page - 1) * oldPageSize;
      let newPage = Math.floor(firstRowIdx / pageSize) + 1;
      newPage = newPage > newPageCount ? newPageCount : newPage;
      newPage = newPage < 1 ? 1 : newPage;
      logger.info(
        `PageSize change to ${pageSize}, setting page to ${newPage}, total page count is ${newPageCount}`,
      );
      const newState: PaginationState = {
        ...stateRef.current,
        page: newPage,
        pageCount: newPageCount,
        pageSize,
      };
      apiRef.current.publishEvent(PAGESIZE_CHANGED, newState as PageChangeParams);

      updateState(newState);
      setPage(newPage);
    },
    [apiRef, setPage, updateState, logger],
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

  const getAutoPageSize = React.useCallback(() => {
    const containerProps = apiRef?.current?.getContainerPropsState();
    return containerProps?.viewportPageSize;
  }, [apiRef]);

  const resetAutopageSize = React.useCallback(() => {
    const autoPagesize = getAutoPageSize();
    if (autoPagesize) {
      logger.debug(`Setting autoPagesize to ${autoPagesize}`);
      setPageSize(autoPagesize);
    }
  }, [setPageSize, logger, getAutoPageSize]);

  useApiEventHandler(apiRef, PAGE_CHANGED, options.onPageChange);
  useApiEventHandler(apiRef, PAGESIZE_CHANGED, options.onPageSizeChange);

  const onResize = React.useCallback(() => {
    if (options.autoPageSize) {
      resetAutopageSize();
    }
  }, [options.autoPageSize, resetAutopageSize]);

  useApiEventHandler(apiRef, RESIZE, onResize);

  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  React.useEffect(() => {
    if (apiRef.current?.isInitialised) {
      apiRef.current.publishEvent(PAGE_CHANGED, stateRef.current);
    }
  }, [apiRef, apiRef.current?.isInitialised]);

  React.useEffect(() => {
    const rowCount = options.rowCount == null ? rows.length : options.rowCount;
    if (rowCount !== state.rowCount) {
      logger.info(`Options or rows change, recalculating pageCount and rowCount`);
      const newPageCount = getPageCount(state.pageSize, rowCount);

      updateState({ pageCount: newPageCount, rowCount });
      setPage(state.page);
    }
  }, [
    rows.length,
    options.rowCount,
    logger,
    updateState,
    state.rowCount,
    state.pageSize,
    setPage,
    state.page,
  ]);

  React.useEffect(() => {
    updateState({ paginationMode: options.paginationMode! });
  }, [options.paginationMode, updateState]);

  React.useEffect(() => {
    setPage(options.page != null ? options.page : 1);
  }, [options.page, setPage]);

  React.useEffect(() => {
    if (
      !options.autoPageSize &&
      options.pageSize &&
      options.pageSize !== stateRef.current.pageSize
    ) {
      setPageSize(options.pageSize);
    }
  }, [options.autoPageSize, options.pageSize, logger, setPageSize]);

  React.useEffect(() => {
    if (options.autoPageSize && columns.visible.length > 0) {
      resetAutopageSize();
    }
  }, [options.autoPageSize, resetAutopageSize, columns.visible.length]);

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
