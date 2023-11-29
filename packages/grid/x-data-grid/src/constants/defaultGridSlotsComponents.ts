import { GridSlotsComponent } from '../models';
import {
  GridSkeletonCell,
  GridColumnsPanel,
  GridFilterPanel,
  GridFooter,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPagination,
  GridPanel,
  GridRow,
  GridColumnHeaderFilterIconButton,
  GridRowCount,
} from '../components';
import { GridCellV7 } from '../components/cell/GridCell';
import { GridColumnHeaders } from '../components/GridColumnHeaders';
import { GridColumnMenu } from '../components/menu/columnMenu/GridColumnMenu';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import materialSlots from '../material';

// TODO: camelCase these key. It's a private helper now.
// Remove then need to call `uncapitalizeObjectKeys`.
export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...materialSlots,
  cell: GridCellV7,
  skeletonCell: GridSkeletonCell,
  columnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  columnMenu: GridColumnMenu,
  columnHeaders: GridColumnHeaders,
  footer: GridFooter,
  footerRowCount: GridRowCount,
  toolbar: null,
  loadingOverlay: GridLoadingOverlay,
  noResultsOverlay: GridNoResultsOverlay,
  noRowsOverlay: GridNoRowsOverlay,
  pagination: GridPagination,
  filterPanel: GridFilterPanel,
  columnsPanel: GridColumnsPanel,
  panel: GridPanel,
  row: GridRow,
};
