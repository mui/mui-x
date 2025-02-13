import type {
  GridColumnMenuState,
  GridColumnsInitialState,
  GridColumnsState,
  GridColumnsGroupingState,
  GridColumnPinningState,
  GridDensityState,
  GridDimensionsState,
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
  GridVirtualizationState,
} from '../hooks';
import type { DataGridProps } from './props/DataGridProps';
import type { GridRowsMetaState } from '../hooks/features/rows/gridRowsMetaState';
import type { GridEditingState } from './gridEditRowModel';
import { GridHeaderFilteringState } from './gridHeaderFilteringModel';
import type { GridRowSelectionModel } from './gridRowSelectionModel';
import type { GridVisibleRowsLookupState } from '../hooks/features/filter/gridFilterState';
import type { GridColumnResizeState } from '../hooks/features/columnResize';
import type { GridRowSpanningState } from '../hooks/features/rows/useGridRowSpanning';
import type { GridListViewState } from '../hooks/features/listView/useGridListView';

/**
 * Some props are passed on the state to enable grid selectors to select
 * and react to them.
 */
type GridStateProps = Pick<DataGridProps, 'getRowId'>;

/**
 * The state of Data Grid.
 */
export interface GridStateCommunity {
  isRtl: boolean;
  props: GridStateProps;
  dimensions: GridDimensionsState;
  rows: GridRowsState;
  visibleRowsLookup: GridVisibleRowsLookupState;
  rowsMeta: GridRowsMetaState;
  editRows: GridEditingState;
  headerFiltering: GridHeaderFilteringState;
  pagination: GridPaginationState;
  columns: GridColumnsState;
  columnGrouping: GridColumnsGroupingState;
  columnMenu: GridColumnMenuState;
  pinnedColumns: GridColumnPinningState;
  sorting: GridSortingState;
  focus: GridFocusState;
  tabIndex: GridTabIndexState;
  rowSelection: GridRowSelectionModel;
  filter: GridFilterState;
  preferencePanel: GridPreferencePanelState;
  density: GridDensityState;
  virtualization: GridVirtualizationState;
  columnResize: GridColumnResizeState;
  rowSpanning: GridRowSpanningState;
  listViewColumn: GridListViewState;
}

/**
 * The initial state of Data Grid.
 */
export interface GridInitialStateCommunity {
  pagination?: GridPaginationInitialState;
  sorting?: GridSortingInitialState;
  filter?: GridFilterInitialState;
  columns?: GridColumnsInitialState;
  preferencePanel?: GridPreferencePanelInitialState;
  density?: GridDensityState;
  scroll?: { top: number; left: number };
}
