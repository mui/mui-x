import type {
  GridColumnsInitialState,
  GridColumnsState,
} from '../hooks/features/columns/gridColumnsInterfaces';
import type { GridEditRowsModel } from './gridEditRowModel';
import type { GridColumnMenuState } from '../hooks/features/columnMenu/columnMenuState';
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
