import { ApiRef, FeatureMode, FeatureModeConstant, PageChangeParams } from '../../../models';
import { PAGE_CHANGED, PAGESIZE_CHANGED } from '../../../constants';

export interface PaginationState {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  paginationMode: FeatureMode;
}

const SET_PAGE_ACTION = 'SetPage';
const SET_PAGESIZE_ACTION = 'SetPageSize';
const SET_PAGINATION_MODE_ACTION = 'SetPaginationMode';
const SET_ROWCOUNT_ACTION = 'setRowCount';

type SetPageAction = { type: 'SetPage'; payload: { page: number; apiRef: ApiRef } };
type SetPageSizeAction = { type: 'SetPageSize'; payload: { pageSize: number; apiRef: ApiRef } };
type SetPaginationModeAction = {
  type: 'SetPaginationMode';
  payload: { paginationMode: FeatureMode; apiRef: ApiRef };
};
type SetRowCountAction = {
  type: 'setRowCount';
  payload: { totalRowCount: number; apiRef: ApiRef };
};

export type PaginationActions =
  | SetPageAction
  | SetPageSizeAction
  | SetPaginationModeAction
  | SetRowCountAction;

// ACTION CREATORS
export function setPageActionCreator(page: any, apiRef: ApiRef): SetPageAction {
  return { type: SET_PAGE_ACTION, payload: { page, apiRef } };
}

export function setPageSizeActionCreator(pageSize: any, apiRef: ApiRef): SetPageSizeAction {
  return { type: SET_PAGESIZE_ACTION, payload: { pageSize, apiRef } };
}

export function setPaginationModeActionCreator(payload: {
  paginationMode: any;
  apiRef: ApiRef;
}): SetPaginationModeAction {
  return { type: SET_PAGINATION_MODE_ACTION, payload };
}

export function setRowCountActionCreator(payload: {
  totalRowCount: number;
  apiRef: ApiRef;
}): SetRowCountAction {
  return { type: SET_ROWCOUNT_ACTION, payload };
}

// HELPERS
export const getPageCount = (pageSize: number | undefined, rowsCount: number) => {
  return pageSize && rowsCount > 0 ? Math.ceil(rowsCount / pageSize!) : 1;
};
// STATE UPDATE PURE FUNCTIONS
export const setPageStateUpdate = (state: PaginationState, payload: any): PaginationState => {
  // eslint-disable-next-line prefer-const
  let { page, apiRef } = payload;
  if (state.rowCount > 0) {
    page = state.pageCount >= page ? page : state.pageCount;

    if (state.page !== page) {
      const params: PageChangeParams = {...state, page};
      apiRef.current.publishEvent(PAGE_CHANGED, params);
      return {...state, page};
    }
  }
  return state;
};
export const setPageSizeStateUpdate = (state: PaginationState, payload: any): PaginationState => {
  // eslint-disable-next-line prefer-const
  let { pageSize, apiRef } = payload;
  if (state.pageSize === pageSize) {
    return state;
  }

  const oldPageSize = state.pageSize;
  const newPageCount = getPageCount(pageSize, state.rowCount);
  const firstRowIdx = (state.page - 1) * oldPageSize;
  let newPage = Math.floor(firstRowIdx / pageSize) + 1;
  newPage = newPage > newPageCount ? newPageCount : newPage;
  newPage = newPage < 1 ? 1 : newPage;

  let newState: PaginationState = {
    ...state,
    page: newPage,
    pageCount: newPageCount,
    pageSize,
  };
  apiRef.current.publishEvent(PAGESIZE_CHANGED, newState as PageChangeParams);

  newState = setPageStateUpdate(newState, { page: newPage, apiRef });
  return newState;
};

export const setRowCountStateUpdate = (state, payload): PaginationState => {
  const { totalRowCount } = payload;
  if (state.rowCount !== totalRowCount) {
    const newPageCount = getPageCount(state.pageSize, totalRowCount);
    return { ...state, pageCount: newPageCount, rowCount: totalRowCount };
  }
  return state;
};

export const INITIAL_PAGINATION_STATE: PaginationState = {
  page: 1,
  pageCount: 0,
  pageSize: 0,
  paginationMode: 'client',
  rowCount: 0,
};

// REDUCER
export const paginationReducer = (state: PaginationState, action: PaginationActions) => {
  const apiState = action.payload.apiRef.current.state;
  switch (action.type) {
    case SET_PAGE_ACTION:
      return setPageStateUpdate(apiState.pagination, action.payload);
    case SET_PAGESIZE_ACTION:
      return setPageSizeStateUpdate(apiState.pagination, action.payload);
    case SET_PAGINATION_MODE_ACTION:
      return { ...apiState.pagination, ...{ paginationMode: action.payload!.paginationMode! } };
    case SET_ROWCOUNT_ACTION:
      return setRowCountStateUpdate(apiState.pagination, action.payload);
    default:
      throw new Error(`Material-UI: Action not found - ${JSON.stringify(action)}`);
  }
};
