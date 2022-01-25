import type {
  GridColumnsInitialState,
  GridColumnsState,
} from '../hooks/features/columns/gridColumnsInterfaces';
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
import { GridRowsMetaState } from '../hooks/features/rows/gridRowsMetaState';

/**
 * The state of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridStateCommunity {
  rows: GridRowsState;
  rowsMeta: GridRowsMetaState;
  editRows: GridEditRowsModel;
  pagination: GridPaginationState;
  columns: GridColumnsState;
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
}

/**
 * The state of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridStatePro extends GridStateCommunity {
  columnReorder: GridColumnReorderState;
  columnResize: GridColumnResizeState;
  pinnedColumns: GridColumnPinningState;
  rowGrouping: GridRowGroupingState;
}

/**
 * @deprecated Use `GridStateCommunity` or `GridStatePro` instead.
 */
export interface GridState extends GridStatePro {}

/**
 * The initial state of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridInitialStateCommunity {
  pagination?: GridPaginationInitialState;
  sorting?: GridSortingInitialState;
  filter?: GridFilterInitialState;
  columns?: GridColumnsInitialState;
  preferencePanel?: GridPreferencePanelInitialState;
}

/**
 * The initial state of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridInitialStatePro extends GridInitialStateCommunity {
  rowGrouping?: GridRowGroupingInitialState;
  pinnedColumns?: GridColumnPinningState;
}

/**
 * @deprecated Use `GridInitialStateCommunity` or `GridInitialStatePro` instead.
 */
export interface GridInitialState extends GridInitialStatePro {}
