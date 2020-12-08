import { getInitialColumnsState, InternalColumns } from '../../../models/colDef/colDef';
import { ContainerProps, ScrollBarState, ViewportSizeState } from '../../../models/containerProps';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { ColumnMenuState } from '../columnMenu/columnMenuState';
import {
  ColumnReorderState,
  getInitialColumnReorderState,
} from '../columnReorder/columnReorderState';
import { DensityState, getInitialDensityState } from '../density/densityState';
import { FilterModelState, getInitialFilterState } from '../filter/FilterModelState';
import { getInitialVisibleRowsState, VisibleRowsState } from '../filter/visibleRowsState';
import { KeyboardState } from '../keyboard/keyboardState';
import { INITIAL_PAGINATION_STATE, PaginationState } from '../pagination/paginationReducer';
import { PreferencePanelState } from '../preferencesPanel/preferencePanelState';
import { getInitialRowState, InternalRowsState } from '../rows/rowsState';
import { SelectionState } from '../selection/selectionState';
import { getInitialSortingState, SortingState } from '../sorting/sortingState';
import { getInitialRenderingState, InternalRenderingState } from '../virtualization/renderingState';

export interface GridState {
  rows: InternalRowsState;
  pagination: PaginationState;
  options: GridOptions;
  isScrolling: boolean;
  columns: InternalColumns;
  columnReorder: ColumnReorderState;
  columnMenu: ColumnMenuState;
  rendering: InternalRenderingState;
  containerSizes: ContainerProps | null;
  viewportSizes: ViewportSizeState;
  scrollBar: ScrollBarState;
  sorting: SortingState;
  keyboard: KeyboardState;
  selection: SelectionState;
  filter: FilterModelState;
  visibleRows: VisibleRowsState;
  preferencePanel: PreferencePanelState;
  density: DensityState;
}

export const getInitialState: () => GridState = () => ({
  rows: getInitialRowState(),
  pagination: INITIAL_PAGINATION_STATE,
  options: DEFAULT_GRID_OPTIONS,
  isScrolling: false,
  columns: getInitialColumnsState(),
  columnReorder: getInitialColumnReorderState(),
  rendering: getInitialRenderingState(),
  containerSizes: null,
  scrollBar: { hasScrollX: false, hasScrollY: false, scrollBarSize: { x: 0, y: 0 } },
  viewportSizes: { width: 0, height: 1 },
  sorting: getInitialSortingState(),
  keyboard: { cell: null, isMultipleKeyPressed: false },
  selection: {},
  filter: getInitialFilterState(),
  columnMenu: { open: false },
  preferencePanel: { open: false },
  visibleRows: getInitialVisibleRowsState(),
  density: getInitialDensityState(),
});
