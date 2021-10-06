import { GridColumnsState } from './colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from './gridContainerProps';
import { GridFilterModel } from './gridFilterModel';
import { GridEditRowsModel } from './gridEditRowModel';
import { GridColumnMenuState } from '../hooks/features/columnMenu/columnMenuState';
import {
  GridColumnReorderState,
} from '../hooks/features/columnReorder/columnReorderState';
import {
  GridColumnResizeState,
} from '../hooks/features/columnResize/columnResizeState';
import { GridDensityState } from '../hooks/features/density/densityState';
import {
  VisibleGridRowsState,
} from '../hooks/features/filter/visibleGridRowsState';
import { GridFocusState, GridTabIndexState } from '../hooks/features/focus/gridFocusState';
import { GridPreferencePanelState } from '../hooks/features/preferencesPanel/gridPreferencePanelState';
import { GridRowsState } from '../hooks/features/rows/gridRowsState';
import { GridSelectionModel } from './gridSelectionModel';
import { GridSortingState } from '../hooks/features/sorting/gridSortingState';
import { GridRenderingState } from '../hooks/features/virtualization/renderingState';
import { GridPaginationState } from '../hooks/features/pagination/gridPaginationState';

export interface GridState {
  rows: GridRowsState;
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  columns: GridColumnsState;
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  columnMenu: GridColumnMenuState;
  rendering: GridRenderingState;
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
  density: GridDensityState;
  error?: any;
}

