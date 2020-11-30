import { FeatureMode } from '../../../models/featureMode';

export interface PaginationState {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  paginationMode: FeatureMode;
}

const SET_PAGE_ACTION = 'SET_PAGE_ACTION';
const SET_PAGESIZE_ACTION = 'SET_PAGESIZE_ACTION';
const SET_PAGINATION_MODE_ACTION = 'SET_PAGINATION_MODE_ACTION';
const SET_ROWCOUNT_ACTION = 'SET_ROWCOUNT_ACTION';

type SetPageAction = { type: typeof SET_PAGE_ACTION; payload: { page: number } };
type SetPageSizeAction = { type: typeof SET_PAGESIZE_ACTION; payload: { pageSize: number } };
type SetPaginationModeAction = {
  type: typeof SET_PAGINATION_MODE_ACTION;
  payload: { paginationMode: FeatureMode };
};
type SetRowCountAction = {
  type: typeof SET_ROWCOUNT_ACTION;
  payload: { totalRowCount: number };
};

export type PaginationActions =
  | SetPageAction
  | SetPageSizeAction
  | SetPaginationModeAction
  | SetRowCountAction;

// ACTION CREATORS
export function setPageActionCreator(page: number): SetPageAction {
  return { type: SET_PAGE_ACTION, payload: { page } };
}

export function setPageSizeActionCreator(pageSize: number): SetPageSizeAction {
  return { type: SET_PAGESIZE_ACTION, payload: { pageSize } };
}

export function setPaginationModeActionCreator(payload: {
  paginationMode: any;
}): SetPaginationModeAction {
  return { type: SET_PAGINATION_MODE_ACTION, payload };
}

export function setRowCountActionCreator(payload: { totalRowCount: number }): SetRowCountAction {
  return { type: SET_ROWCOUNT_ACTION, payload };
}

// HELPERS
export const getPageCount = (pageSize: number | undefined, rowsCount: number) => {
  return pageSize && rowsCount > 0 ? Math.ceil(rowsCount / pageSize!) : 1;
};
// STATE UPDATE PURE FUNCTIONS
export const setPageStateUpdate = (
  state: PaginationState,
  { page }: { page: number },
): PaginationState => {
  return state.page !== page ? { ...state, page } : state;
};

export const setPageSizeStateUpdate = (
  state: PaginationState,
  payload: { pageSize: number },
): PaginationState => {
  const { pageSize } = payload;
  if (state.pageSize === pageSize) {
    return state;
  }

  const newState: PaginationState = {
    ...state,
    pageSize,
    pageCount: getPageCount(pageSize, state.rowCount),
  };
  return newState;
};

export const setRowCountStateUpdate = (state, payload): PaginationState => {
  const { totalRowCount } = payload;
  if (state.rowCount !== totalRowCount) {
    const newPageCount = getPageCount(state.pageSize, totalRowCount);
    return {
      ...state,
      pageCount: newPageCount,
      rowCount: totalRowCount,
      page: state.page > newPageCount ? newPageCount : state.page,
    };
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
  switch (action.type) {
    case SET_PAGE_ACTION:
      return setPageStateUpdate(state, action.payload);
    case SET_PAGESIZE_ACTION:
      return setPageSizeStateUpdate(state, action.payload);
    case SET_PAGINATION_MODE_ACTION:
      return { ...state, paginationMode: action.payload!.paginationMode! };
    case SET_ROWCOUNT_ACTION:
      return setRowCountStateUpdate(state, action.payload);
    default:
      throw new Error(`Material-UI: Action not found - ${JSON.stringify(action)}`);
  }
};
