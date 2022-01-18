import type { GridColumnsState } from '../hooks/features/columns/gridColumnsInterfaces';
import type { GridEditRowsModel } from './gridEditRowModel';
import type { GridColumnMenuState } from '../hooks/features/columnMenu/columnMenuState';
import type { GridColumnReorderState } from '../hooks/features/columnReorder';
import type { GridColumnResizeState } from '../hooks/features/columnResize/columnResizeState';
import type { GridDensityState } from '../hooks/features/density/densityState';
import type { GridFocusState, GridTabIndexState } from '../hooks/features/focus/gridFocusState';
import type {
  GridPreferencePanelState,
  GridPreferencePanelInitialState,
} from '../hooks/features/preferencesPanel/gridPreferencePanelState';
import type { GridRowsState } from '../hooks/features/rows/gridRowsState';
import type { GridSelectionModel } from './gridSelectionModel';
import type {
  GridSortingState,
  GridSortingInitialState,
} from '../hooks/features/sorting/gridSortingState';
import type { GridPaginationState, GridPaginationInitialState } from '../hooks/features/pagination';
import type {
  GridFilterState,
  GridFilterInitialState,
} from '../hooks/features/filter/gridFilterState';
import type {
  GridRowGroupingState,
  GridRowGroupingInitialState,
} from '../hooks/features/rowGrouping';
import { GridColumnPinningState } from '../hooks/features/columnPinning/gridColumnPinningState';

/**
 * TODO: Distinguish pro and community states
 */
export interface GridState {
  rows: GridRowsState;
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  columns: GridColumnsState;
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  columnMenu: GridColumnMenuState;
  sorting: GridSortingState;
  focus: GridFocusState;
  tabIndex: GridTabIndexState;
  selection: GridSelectionModel;
  filter: GridFilterState;
  preferencePanel: GridPreferencePanelState;
  density: GridDensityState;
  rowGrouping: GridRowGroupingState;
  error?: any;
  pinnedColumns: GridColumnPinningState;
}

export interface GridInitialState {
  pagination?: GridPaginationInitialState;
  sorting?: GridSortingInitialState;
  filter?: GridFilterInitialState;
  preferencePanel?: GridPreferencePanelInitialState;
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
}
