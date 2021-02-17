import { getInitialGridColumnsState, InternalColumns } from '../../../models/colDef/colDef';
import { ContainerProps, ScrollBarState, ViewportSizeState } from '../../../models/containerProps';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { ColumnMenuState } from '../columnMenu/columnMenuState';
import {
  ColumnReorderState,
  getInitialGridColumnReorderState,
} from '../columnReorder/columnReorderState';
import { DensityState, getInitialDensityState } from '../density/densityState';
import { FilterModelState, getInitialGridFilterState } from '../filter/FilterModelState';
import {
  getInitialVisibleGridRowsState,
  VisibleGridRowsState,
} from '../filter/visibleGridRowsState';
import { KeyboardState } from '../keyboard/keyboardState';
import {
  GRID_INITIAL_PAGINATION_STATE,
  PaginationState,
} from '../pagination/gridPaginationReducer';
import { GridPreferencePanelState } from '../preferencesPanel/gridPreferencePanelState';
import { getInitialGridRowState, InternalGridRowsState } from '../rows/gridRowsState';
import { GridSelectionState } from '../selection/gridSelectionState';
import { getInitialGridSortingState, GridSortingState } from '../sorting/gridSortingState';
import {
  getInitialGridRenderingState,
  InternalRenderingState,
} from '../virtualization/renderingState';

export interface GridState {
  rows: InternalGridRowsState;
  pagination: PaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: InternalColumns;
  columnReorder: ColumnReorderState;
  columnMenu: ColumnMenuState;
  rendering: InternalRenderingState;
  containerSizes: ContainerProps | null;
  viewportSizes: ViewportSizeState;
  scrollBar: ScrollBarState;
  sorting: GridSortingState;
  keyboard: KeyboardState;
  selection: GridSelectionState;
  filter: FilterModelState;
  visibleRows: VisibleGridRowsState;
  preferencePanel: GridPreferencePanelState;
  density: DensityState;
}

export const getInitialGridState: () => GridState = () => ({
  rows: getInitialGridRowState(),
  pagination: GRID_INITIAL_PAGINATION_STATE,
  options: DEFAULT_GRID_OPTIONS,
  isScrolling: false,
  columns: getInitialGridColumnsState(),
  columnReorder: getInitialGridColumnReorderState(),
  rendering: getInitialGridRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, scrollBarSize: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialGridSortingState(),
  keyboard: { cell: null, isMultipleKeyPressed: false },
  selection: {},
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialDensityState(),
});
