import { GridColumnsState } from '../../../models/colDef/gridColDef';
import {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from '../../../models/gridContainerProps';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridColumnMenuState } from '../columnMenu/columnMenuState';
import { GridColumnReorderState } from '../columnReorder/columnReorderState';
import { GridColumnResizeState } from '../columnResize/columnResizeState';
import { GridDensityState } from '../density/densityState';
import { VisibleGridRowsState } from '../filter/visibleGridRowsState';
import { GridFocusState, GridTabIndexState } from '../focus/gridFocusState';
import { GridPreferencePanelState } from '../preferencesPanel/gridPreferencePanelState';
import { InternalGridRowsState } from '../rows/gridRowsState';
import { GridSelectionModel } from '../../../models/gridSelectionModel';
import { GridSortingState } from '../sorting/gridSortingState';
import { GridRenderingState } from '../virtualization/renderingState';
import { GridPaginationState } from '../pagination/gridPaginationState';

export interface GridState {
  rows: InternalGridRowsState;
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
