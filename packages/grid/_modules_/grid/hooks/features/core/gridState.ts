import { InternalColumns } from '../../../models/colDef/colDef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../../models/gridOptions';
import { RowId } from '../../../models/rows';
import {
  getInitialRenderingState,
  InternalRenderingState,
} from '../../virtualization/useVirtualRows';
import { getInitialColumnsState } from '../columns/useColumns';
import { INITIAL_PAGINATION_STATE, PaginationState } from '../pagination/paginationReducer';
import { getInitialRowState, InternalRowsState } from '../rows/rowsState';
import { getInitialSortingState, SortingState } from '../sorting/useSorting';
import { ContainerProps } from '../../../models/containerProps';

interface RowsState {
  rows: InternalRowsState;
}

interface SelectedRowsState {
  selectedRows: RowId[];
}

interface HiddenRowsState {
  hiddenRows: RowId[];
}

interface GridPaginationState {
  pagination: PaginationState;
}

interface GridOptionsState {
  options: GridOptions;
}

interface ScrollingState {
  isScrolling: boolean;
}
interface ColumnState {
  columns: InternalColumns;
}

interface RenderingState {
  rendering: InternalRenderingState;
}
export type GridState = RowsState &
  SelectedRowsState &
  HiddenRowsState &
  GridPaginationState &
  GridOptionsState &
  ScrollingState &
  ColumnState &
  RenderingState & { containerSizes: ContainerProps | null } & { sorting: SortingState };

export const getInitialState: () => GridState = () => ({
  rows: getInitialRowState(),
  selectedRows: [],
  hiddenRows: [],
  pagination: { ...INITIAL_PAGINATION_STATE },
  options: { ...DEFAULT_GRID_OPTIONS },
  isScrolling: false,
  columns: getInitialColumnsState(),
  rendering: getInitialRenderingState(),
  containerSizes: null,
  sorting: getInitialSortingState(),
});
