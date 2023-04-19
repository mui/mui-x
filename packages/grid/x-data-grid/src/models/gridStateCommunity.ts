import type {
  GridColumnMenuState,
  GridColumnsInitialState,
  GridColumnsState,
  GridColumnsGroupingState,
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
import type { GridEditingState } from './gridEditRowModel';
import type { GridRowSelectionModel } from './gridRowSelectionModel';
import type { GridRowId } from './gridRows';

/**
 * The state of `DataGrid`.
 */
export interface GridStateCommunity {
  rows: GridRowsState;
  rowsMeta: GridRowsMetaState;
  editRows: GridEditingState;
  pagination: GridPaginationState;
  columns: GridColumnsState;
  columnGrouping: GridColumnsGroupingState;
  columnMenu: GridColumnMenuState;
  sorting: GridSortingState;
  focus: GridFocusState;
  tabIndex: GridTabIndexState;
  rowSelection: GridRowSelectionModel;
  filter: GridFilterState;
  preferencePanel: GridPreferencePanelState;
  density: GridDensityState;
  /**
   * Visibility status for each row.
   * A row is visible if it is passing the filters AND if its parents are expanded.
   * If a row is not registered in this lookup, it is visible.
   */
  visibleRowsLookup: Record<GridRowId, boolean>;
}

/**
 * The initial state of `DataGrid`.
 */
export interface GridInitialStateCommunity {
  pagination?: GridPaginationInitialState;
  sorting?: GridSortingInitialState;
  filter?: GridFilterInitialState;
  columns?: GridColumnsInitialState;
  preferencePanel?: GridPreferencePanelInitialState;
}
