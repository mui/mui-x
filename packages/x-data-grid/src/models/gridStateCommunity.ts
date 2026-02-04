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
import type { DataGridProcessedProps } from './props/DataGridProps';
import type { GridRowsMetaState } from '../hooks/features/rows/gridRowsMetaState';
import type { GridEditingState } from './gridEditRowModel';
import type { GridHeaderFilteringState } from './gridHeaderFilteringModel';
import type { GridRowSelectionModel } from './gridRowSelectionModel';
import type { GridVisibleRowsLookupState } from '../hooks/features/filter/gridFilterState';
import type { GridColumnResizeState } from '../hooks/features/columnResize';
import type { GridRowSpanningState } from '../hooks/features/rows/useGridRowSpanning';
import type { GridListViewState } from '../hooks/features/listView/useGridListView';
import type { GridRowReorderState } from '../hooks/features/rowReorder/gridRowReorderInterfaces';

/**
 * Some props are passed on the state to enable grid selectors to select
 * and react to them.
 */
export type GridStateProps = Pick<
  DataGridProcessedProps,
  'getRowId' | 'listView' | 'isCellEditable' | 'isRowSelectable' | 'dataSource'
>;

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
  rowReorder: GridRowReorderState;
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
