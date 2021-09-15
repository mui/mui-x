import { getInitialGridColumnsState, GridColumnsState } from '../../../models/colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridColumnMenuState } from '../columnMenu/columnMenuState';
import {
  getInitialGridColumnReorderState,
  GridColumnReorderState,
} from '../columnReorder/columnReorderState';
import {
  getInitialGridColumnResizeState,
  GridColumnResizeState,
} from '../columnResize/columnResizeState';
import { GridGridDensity, getInitialGridDensityState } from '../density/densityState';
import { getInitialGridFilterState } from '../filter/gridFilterModelState';
import {
  getInitialVisibleGridRowsState,
  VisibleGridRowsState,
} from '../filter/visibleGridRowsState';
import { GridFocusState, GridTabIndexState } from '../focus/gridFocusState';
import { GridPreferencePanelState } from '../preferencesPanel/gridPreferencePanelState';
import { getInitialGridRowState, GridRowsState } from '../rows/gridRowsState';
import { GridSelectionModel } from '../../../models/gridSelectionModel';
import { getInitialGridSortingState, GridSortingState } from '../sorting/gridSortingState';
import {
  getInitialGridRenderingState,
  InternalRenderingState,
} from '../virtualization/renderingState';
import { getInitialPaginationState, GridPaginationState } from '../pagination/gridPaginationState';
import { GridTreeDataState } from '../treeData/gridTreeDataState';

export interface GridState {
  rows: GridRowsState;
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  columns: GridColumnsState;
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  columnMenu: GridColumnMenuState;
  rendering: InternalRenderingState;
  containerSizes: GridContainerProps | null;
  viewportSizes: GridViewportSizeState;
  scrollBar: GridScrollBarState;
  sorting: GridSortingState;
  focus: GridFocusState;
  tabIndex: GridTabIndexState;
  selection: GridSelectionModel;
  filter: GridFilterModel;
  visibleRows: VisibleGridRowsState;
  preferencePanel: GridPreferencePanelState;
  density: GridGridDensity;
  treeData: GridTreeDataState;
  error?: any;
}

export const getInitialGridState = (): GridState => ({
  rows: getInitialGridRowState(),
  editRows: {},
  pagination: getInitialPaginationState(),
  columns: getInitialGridColumnsState(),
  columnReorder: getInitialGridColumnReorderState(),
  columnResize: getInitialGridColumnResizeState(),
  rendering: getInitialGridRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, sizes: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialGridSortingState(),
  focus: { cell: null, columnHeader: null },
  tabIndex: { cell: null, columnHeader: null },
  selection: [],
  filter: getInitialGridFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleGridRowsState(),
  density: getInitialGridDensityState(),
  treeData: {
    expandedRows: {},
  },
});
