import type {
  GridColumnMenuState,
  GridColumnsInitialState,
  GridColumnsState,
  GridDensityState,
  GridFilterInitialState,
  GridFilterState,
  GridFocusState,
  GridPaginationInitialState,
  GridPaginationState,
  GridPreferencePanelInitialState,
  GridPreferencePanelState,
  GridRowsState,
  GridSortingInitialState,
  GridSortingState,
  GridTabIndexState,
} from '../hooks';
import type { GridRowsMetaState } from '../hooks/features/rows/gridRowsMetaState';
import type { GridRowsInternalCache } from '../hooks/features/rows/gridRowsState';
import type { GridEditRowsModel } from './gridEditRowModel';
import type { GridSelectionModel } from './gridSelectionModel';

/**
 * The state of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridStateCommunity {
  rows: GridRowsState;
  rowsCache: GridRowsInternalCache;
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
  error?: any;
}

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
