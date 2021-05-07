import { GridFeatureMode } from '../../../models/gridFeatureMode';

export interface GridPaginationState {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  paginationMode: GridFeatureMode;
}

const SET_PAGE_ACTION = 'SET_PAGE_ACTION';
const SET_PAGESIZE_ACTION = 'SET_PAGESIZE_ACTION';
const SET_PAGINATION_MODE_ACTION = 'SET_PAGINATION_MODE_ACTION';
const SET_ROWCOUNT_ACTION = 'SET_ROWCOUNT_ACTION';

type SetPageAction = { type: typeof SET_PAGE_ACTION; payload: { page: number } };
type SetPageSizeAction = { type: typeof SET_PAGESIZE_ACTION; payload: { pageSize: number } };
type SetPaginationModeAction = {
  type: typeof SET_PAGINATION_MODE_ACTION;
  payload: { paginationMode: GridFeatureMode };
};
type SetRowCountAction = {
  type: typeof SET_ROWCOUNT_ACTION;
  payload: { totalRowCount: number };
};

export type GridPaginationActions =
  | SetPageAction
  | SetPageSizeAction
  | SetPaginationModeAction
  | SetRowCountAction;

// ACTION CREATORS
export function setGridPageActionCreator(page: number): SetPageAction {
  return { type: SET_PAGE_ACTION, payload: { page } };
}

export function setGridPageSizeActionCreator(pageSize: number): SetPageSizeAction {
  return { type: SET_PAGESIZE_ACTION, payload: { pageSize } };
}

export function setGridPaginationModeActionCreator(payload: {
  paginationMode: any;
}): SetPaginationModeAction {
  return { type: SET_PAGINATION_MODE_ACTION, payload };
}

export function setGridRowCountActionCreator(payload: {
  totalRowCount: number;
}): SetRowCountAction {
  return { type: SET_ROWCOUNT_ACTION, payload };
}

// HELPERS
export const getGridPageCount = (pageSize: number | undefined, rowsCount: number) => {
  return pageSize && rowsCount > 0 ? Math.ceil(rowsCount / pageSize!) : 1;
};
// STATE UPDATE PURE FUNCTIONS
export const setGridPageStateUpdate = (
  state: GridPaginationState,
  { page }: { page: number },
): GridPaginationState => {
  return state.page !== page ? { ...state, page } : state;
};

export const setGridPageSizeStateUpdate = (
  state: GridPaginationState,
  payload: { pageSize: number },
): GridPaginationState => {
  const { pageSize } = payload;
  if (state.pageSize === pageSize) {
    return state;
  }

  const newState: GridPaginationState = {
    ...state,
    pageSize,
    pageCount: getGridPageCount(pageSize, state.rowCount),
  };
  return newState;
};

export const setGridRowCountStateUpdate = (state, payload): GridPaginationState => {
  const { totalRowCount } = payload;
  if (state.rowCount !== totalRowCount) {
    const newPageCount = getGridPageCount(state.pageSize, totalRowCount);
    return {
      ...state,
      pageCount: newPageCount,
      rowCount: totalRowCount,
      page: state.page > newPageCount ? newPageCount - 1 : state.page,
    };
  }
  return state;
};

export const GRID_INITIAL_PAGINATION_STATE: GridPaginationState = {
  page: 0,
  pageCount: 0,
  pageSize: 0,
  paginationMode: 'client',
  rowCount: 0,
};

// REDUCER
export const gridPaginationReducer = (
  state: GridPaginationState,
  action: GridPaginationActions,
) => {
  switch (action.type) {
    case SET_PAGE_ACTION:
      return setGridPageStateUpdate(state, action.payload);
    case SET_PAGESIZE_ACTION:
      return setGridPageSizeStateUpdate(state, action.payload);
    case SET_PAGINATION_MODE_ACTION:
      return { ...state, paginationMode: action.payload!.paginationMode! };
    case SET_ROWCOUNT_ACTION:
      return setGridRowCountStateUpdate(state, action.payload);
    default:
      throw new Error(`Material-UI: Action not found - ${JSON.stringify(action)}`);
  }
};
