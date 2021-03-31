import { getInitialGridColumnsState, GridInternalColumns } from '../../../models/colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { GridColumnMenuState } from '../columnMenu/columnMenuState';
import {
  GridColumnReorderState,
  getInitialGridColumnReorderState,
} from '../columnReorder/columnReorderState';
import { GridGridDensity, getInitialGridDensityState } from '../density/densityState';
import { GridFilterModelState, getInitialGridFilterState } from '../filter/gridFilterModelState';
import {
  getInitialVisibleGridRowsState,
  VisibleGridRowsState,
} from '../filter/visibleGridRowsState';
import { GridKeyboardState } from '../keyboard/gridKeyboardState';
import {
  GRID_INITIAL_PAGINATION_STATE,
  GridPaginationState,
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
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: GridInternalColumns;
  columnReorder: GridColumnReorderState;
  columnMenu: GridColumnMenuState;
  rendering: InternalRenderingState;
  containerSizes: GridContainerProps | null;
  viewportSizes: GridViewportSizeState;
  scrollBar: GridScrollBarState;
  sorting: GridSortingState;
  keyboard: GridKeyboardState;
  selection: GridSelectionState;
  filter: GridFilterModelState;
  visibleRows: VisibleGridRowsState;
  preferencePanel: GridPreferencePanelState;
  density: GridGridDensity;
}

export const getInitialGridState: () => GridState = () => ({
  rows: getInitialGridRowState(),
  editRows: {},
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
  keyboard: { cell: null, columnHeader: null, isMultipleKeyPressed: false },
  selection: {},
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialGridDensityState(),
});
