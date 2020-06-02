import { useEffect, useReducer, useRef } from 'react';
import { GridApi, GridOptions, PaginationApi, Rows } from '../../models';
import { GridApiRef } from '../../grid';
import { useLogger } from '../utils';
import { PAGE_CHANGED_EVENT, PAGESIZE_CHANGED_EVENT } from '../../constants/eventsConstants';

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}
export type PageChangedParams = PaginationState;
export interface PaginationState {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
}

const UPDATE_STATE_ACTION = 'updateState';

function updateStateAction(
  state: Partial<PaginationState>,
): { type: 'updateState'; payload: Partial<PaginationState> } {
  return { type: UPDATE_STATE_ACTION, payload: state };
}

function paginationReducer(state: PaginationState, action: { type: string; payload?: Partial<PaginationState> }) {
  if (action.type === UPDATE_STATE_ACTION) {
    return { ...state, ...action.payload };
  }
  throw new Error(`Action ${action.type} not found.`);
}

const getPageCount = (pageSize: number | undefined, rowsCount: number) => {
  return pageSize ? Math.ceil(rowsCount / pageSize!) : 1;
};

export const usePagination = (rows: Rows, options: GridOptions, apiRef: GridApiRef): PaginationProps => {
  const logger = useLogger('usePagination');

  const initialState: PaginationState = {
    pageSize: options.paginationPageSize || 0,
    rowCount: rows.length,
    page: 1,
    pageCount: getPageCount(options.paginationPageSize, rows.length),
  };
  const stateRef = useRef(initialState);
  const [state, dispatch] = useReducer(paginationReducer, initialState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setPage = (page: number) => {
    if (apiRef && apiRef.current) {
      apiRef.current!.renderPage(page);
      const params: PageChangedParams = {
        ...stateRef.current,
        page,
      };
      apiRef.current!.emit(PAGE_CHANGED_EVENT, params);
    }
    if (stateRef.current.page !== page) {
      dispatch(updateStateAction({ page }));
    }
  };

  //We use stateRef in this method to avoid reattaching this method to the api every time the state changes
  const setPageSize = (pageSize: number) => {
    const oldPageSize = options.paginationPageSize!;
    const newPageCount = getPageCount(pageSize, stateRef.current.rowCount);
    const firstRowIdx = (stateRef.current.page - 1) * oldPageSize;
    let newPage = Math.floor(firstRowIdx / pageSize) + 1;
    newPage = newPage > newPageCount ? newPageCount : newPage;
    newPage = newPage < 1 ? 1 : newPage;
    logger.info(`PageSize changed to ${pageSize}, setting page to ${newPage}, total page count is ${newPageCount}`);
    const newState: PaginationState = {
      ...stateRef.current,
      page: newPage,
      pageCount: newPageCount,
      pageSize,
    };
    apiRef.current!.emit(PAGESIZE_CHANGED_EVENT, newState as PageChangedParams);

    dispatch(updateStateAction(newState));
    setPage(newPage);
  };

  const onPageChanged = (handler: (param: PageChangedParams) => void): (() => void) => {
    return apiRef!.current!.registerEvent(PAGE_CHANGED_EVENT, handler);
  };
  const onPageSizeChanged = (handler: (param: PageChangedParams) => void): (() => void) => {
    return apiRef!.current!.registerEvent(PAGESIZE_CHANGED_EVENT, handler);
  };

  useEffect(() => {
    if (options.paginationPageSize !== state.pageSize || rows.length !== state.rowCount) {
      logger.info(`Options or rows changed, recalculating pageCount and rowCount`);
      const newPageCount = getPageCount(options.paginationPageSize, rows.length);

      dispatch(updateStateAction({ pageCount: newPageCount, rowCount: rows.length }));
    }
  }, [rows, options]);

  useEffect(() => {
    const subscription: any[] = [];
    if (options.onPageChanged) {
      subscription.push(onPageChanged(options.onPageChanged));
    }
    if (options.onPageSizeChanged) {
      subscription.push(onPageSizeChanged(options.onPageSizeChanged));
    }
    return () => {
      logger.info('Clearing pagination event listeners.');
      subscription.forEach(sub => sub());
    };
  }, [options]);

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Adding pagination api to apiRef');

      const paginationApi: PaginationApi = {
        setPageSize,
        setPage,
        onPageChanged,
        onPageSizeChanged,
      };

      apiRef.current = Object.assign(apiRef.current, paginationApi) as GridApi;
    }
  }, [apiRef, dispatch]);

  return {
    ...state,
    setPage,
    setPageSize,
  };
};
