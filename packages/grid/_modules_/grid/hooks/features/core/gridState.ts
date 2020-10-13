import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { RowId } from '../../../models/rows';
import { INITIAL_PAGINATION_STATE, PaginationState } from '../pagination/paginationReducer';
import { getInitialRowState, InternalRowsState } from '../rows/rowsReducer';

interface RowsState {
  rows: InternalRowsState;
}

interface SelectedRowsState {
  selectedRows: RowId[];
}

interface HiddenRowsState {
  hiddenRows: RowId[];
}

interface GridPaginationState {
  pagination: PaginationState;
}

interface GridOptionsState {
  options: GridOptions;
}

interface ScrollingState {
  isScrolling: boolean;
}

export type GridState = RowsState &
  SelectedRowsState &
  HiddenRowsState &
  GridPaginationState &
  GridOptionsState &
  ScrollingState;

export const getInitialState: () => GridState = () => ({
  rows: getInitialRowState(),
  selectedRows: [],
  hiddenRows: [],
  pagination: { ...INITIAL_PAGINATION_STATE },
  options: { ...DEFAULT_GRID_OPTIONS },
  isScrolling: false,
});
