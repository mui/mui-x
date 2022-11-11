import { GridSlotsComponent } from '../models';
import {
  GridCell,
  GridSkeletonCell,
  GridColumnMenu,
  GridColumnsPanel,
  GridFilterPanel,
  GridFooter,
  GridHeader,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPanel,
  GridPreferencesPanel,
  GridRow,
  GridColumnHeaderFilterIconButton,
} from '../components';
import { ErrorOverlay } from '../components/ErrorOverlay';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import materialSlots from '../material';

/**
 * TODO: Differentiate community and pro value and interface
 */
export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...materialSlots,
  Cell: GridCell, // doesn't use Material UI
  SkeletonCell: GridSkeletonCell, // doesn't use Material UI
  ColumnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  ColumnMenu: GridColumnMenu,
  ErrorOverlay,
  Footer: GridFooter,
  Header: GridHeader,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  FilterPanel: GridFilterPanel,
  ColumnsPanel: GridColumnsPanel,
  Panel: GridPanel,
  Row: GridRow,
};
