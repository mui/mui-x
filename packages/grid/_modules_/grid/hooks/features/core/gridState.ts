import { GridColumnsState } from '../../../models/colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridColumnMenuState } from '../columnMenu/columnMenuState';
import { GridColumnReorderState } from '../columnReorder/columnReorderState';
import { GridColumnResizeState } from '../columnResize/columnResizeState';
import { GridDensityState } from '../density/densityState';
import { GridFilterInitialState, GridFilterState } from '../filter/gridFilterState';
import { GridFocusState, GridTabIndexState } from '../focus/gridFocusState';
import {
  GridPreferencePanelInitialState,
  GridPreferencePanelState,
} from '../preferencesPanel/gridPreferencePanelState';
import { GridRowsState } from '../rows/gridRowsState';
import { GridSelectionModel } from '../../../models/gridSelectionModel';
import { GridSortingInitialState, GridSortingState } from '../sorting/gridSortingState';
import { GridRenderingState } from '../virtualization/renderingState';
import { GridPaginationState } from '../pagination/gridPaginationState';

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
  filter: GridFilterState;
  preferencePanel: GridPreferencePanelState;
  density: GridDensityState;
  error?: any;
}

export interface GridInitialState {
  sorting?: GridSortingInitialState;
  filter?: GridFilterInitialState;
  preferencePanel?: GridPreferencePanelInitialState;
}
