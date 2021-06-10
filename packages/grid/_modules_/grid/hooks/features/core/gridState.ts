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
import {
  getInitialGridColumnResizeState,
  GridColumnResizeState,
} from '../columnResize/columnResizeState';
import { GridGridDensity, getInitialGridDensityState } from '../density/densityState';
import { GridFilterModelState, getInitialGridFilterState } from '../filter/gridFilterModelState';
import {
  getInitialVisibleGridRowsState,
  VisibleGridRowsState,
} from '../filter/visibleGridRowsState';
import { GridFocusState, GridTabIndexState } from '../focus/gridFocusState';
import { GridPaginationState } from '../pagination/gridPaginationState';
import { GridPreferencePanelState } from '../preferencesPanel/gridPreferencePanelState';
import { getInitialGridRowState, InternalGridRowsState } from '../rows/gridRowsState';
import { GridSelectionState } from '../selection/gridSelectionState';
import { getInitialGridSortingState, GridSortingState } from '../sorting/gridSortingState';
import {
  getInitialGridRenderingState,
  InternalRenderingState,
} from '../virtualization/renderingState';
import { ControlStateItem } from './useControlState';

export interface GridState {
  columns: GridInternalColumns;
  columnMenu: GridColumnMenuState;
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  containerSizes: GridContainerProps | null;
  density: GridGridDensity;
  editRows: GridEditRowsModel;
  error?: any;
  filter: GridFilterModelState;
  focus: GridFocusState;
  isScrolling: boolean;
  options: GridOptions;
  pagination: GridPaginationState;
  preferencePanel: GridPreferencePanelState;
  rows: InternalGridRowsState;
  rendering: InternalRenderingState;
  scrollBar: GridScrollBarState;
  selection: GridSelectionState;
  sorting: GridSortingState;
  tabIndex: GridTabIndexState;
  viewportSizes: GridViewportSizeState;
  visibleRows: VisibleGridRowsState;
}

export const getInitialGridState: () => GridState = () => ({
  rows: getInitialGridRowState(),
  editRows: {},
  pagination: {
    page: 0,
    pageCount: 0,
    pageSize: 0,
    paginationMode: 'client',
    rowCount: 0,
  },
  options: DEFAULT_GRID_OPTIONS,
  isScrolling: false,
  columns: getInitialGridColumnsState(),
  columnReorder: getInitialGridColumnReorderState(),
  columnResize: getInitialGridColumnResizeState(),
  rendering: getInitialGridRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, scrollBarSize: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialGridSortingState(),
  focus: { cell: null, columnHeader: null },
  tabIndex: { cell: null, columnHeader: null },
  selection: {},
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialGridDensityState(),
});
