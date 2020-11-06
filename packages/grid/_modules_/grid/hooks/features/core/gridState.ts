import { getInitialColumnsState, InternalColumns } from '../../../models/colDef/colDef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { SelectionState } from '../selection/selectionState';
import { getInitialRenderingState, InternalRenderingState } from '../virtualization/renderingState';
import { KeyboardState } from '../keyboard/keyboardState';
import { INITIAL_PAGINATION_STATE, PaginationState } from '../pagination/paginationReducer';
import { getInitialRowState, InternalRowsState } from '../rows/rowsState';
import { getInitialSortingState, SortingState } from '../sorting/sortingState';
import { ContainerProps, ScrollBarState, ViewportSizeState } from '../../../models/containerProps';
import {
  ColumnReorderState,
  getInitialColumnReorderState,
} from '../columnReorder/columnReorderState';

export interface GridState {
  rows: InternalRowsState;
  pagination: PaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: InternalColumns;
  columnReorder: ColumnReorderState;
  rendering: InternalRenderingState;
  containerSizes: ContainerProps | null;
  viewportSizes: ViewportSizeState;
  scrollBar: ScrollBarState;
  sorting: SortingState;
  keyboard: KeyboardState;
  selection: SelectionState;
}

export const getInitialState: () => GridState = () => ({
  rows: getInitialRowState(),
  pagination: INITIAL_PAGINATION_STATE,
  options: DEFAULT_GRID_OPTIONS,
  isScrolling: false,
  columns: getInitialColumnsState(),
  columnReorder: getInitialColumnReorderState(),
  rendering: getInitialRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, scrollBarSize: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialSortingState(),
  keyboard: { cell: null, isMultipleKeyPressed: false },
  selection: {},
});
