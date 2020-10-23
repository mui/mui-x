import { getInitialColumnsState, InternalColumns } from '../../../models/colDef/colDef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { getInitialRenderingState, InternalRenderingState } from '../virtualization/renderingState';
import { KeyboardState } from '../keyboard/keyboardState';
import { INITIAL_PAGINATION_STATE, PaginationState } from '../pagination/paginationReducer';
import { getInitialRowState, InternalRowsState } from '../rows/rowsState';
import { getInitialSortingState, SortingState } from '../sorting/sortingState';
import { ContainerProps } from '../../../models/containerProps';

export interface GridState {
  rows: InternalRowsState;
  pagination: PaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: InternalColumns;
  rendering: InternalRenderingState;
  containerSizes: ContainerProps | null;
  sorting: SortingState;
  keyboard: KeyboardState;
}

export const getInitialState: () => GridState = () => ({
  rows: getInitialRowState(),
  selectedRows: [],
  hiddenRows: [],
  pagination: { ...INITIAL_PAGINATION_STATE },
  options: { ...DEFAULT_GRID_OPTIONS },
  isScrolling: false,
  columns: getInitialColumnsState(),
  rendering: getInitialRenderingState(),
  containerSizes: null,
  sorting: getInitialSortingState(),
  keyboard: { cell: null },
});
