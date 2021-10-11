import { GridColumnsState } from './colDef/gridColDef';
import type {
  GridContainerProps,
  GridScrollBarState,
  GridViewportSizeState,
} from './gridContainerProps';
import type { GridEditRowsModel } from './gridEditRowModel';
import type { GridColumnMenuState } from '../hooks/features/columnMenu/columnMenuState';
import type { GridColumnReorderState } from '../hooks/features/columnReorder/columnReorderState';
import type { GridColumnResizeState } from '../hooks/features/columnResize/columnResizeState';
import type { GridDensityState } from '../hooks/features/density/densityState';
import type { GridFocusState, GridTabIndexState } from '../hooks/features/focus/gridFocusState';
import type { GridPreferencePanelState } from '../hooks/features/preferencesPanel/gridPreferencePanelState';
import type { GridRowsState } from '../hooks/features/rows/gridRowsState';
import type { GridSelectionModel } from './gridSelectionModel';
import type { GridSortingState } from '../hooks/features/sorting/gridSortingState';
import type { GridRenderingState } from '../hooks/features/virtualization/renderingState';
import type { GridPaginationState } from '../hooks/features/pagination/gridPaginationState';
import type { GridFilterState } from '../hooks/features/filter/gridFilterState';

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
