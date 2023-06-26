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
  GridPreferencesPanel,
  GridRow,
  GridColumnHeaderFilterIconButton,
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
  Cell: GridCellV7,
  SkeletonCell: GridSkeletonCell,
  ColumnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  ColumnMenu: GridColumnMenu,
  ColumnHeaders: GridColumnHeaders,
  Footer: GridFooter,
  Toolbar: null,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  Pagination: GridPagination,
  FilterPanel: GridFilterPanel,
  ColumnsPanel: GridColumnsPanel,
  Panel: GridPanel,
  Row: GridRow,
};
