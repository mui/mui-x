import { GridSlotsComponent } from '../models';
import {
  GridCell,
  GridSkeletonCell,
  GridColumnMenu,
  GridColumnsPanel,
  GridFilterPanel,
  GridFooter,
  GridHeader,
  GridNoRowsOverlay,
  GridPanel,
  GridPreferencesPanel,
  GridRow,
} from '../components';
import { GridErrorOverlay } from '../components/GridErrorOverlay';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import materialSlots from '../material';

/**
 * TODO: Differentiate community and pro value and interface
 */
export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...materialSlots,
  Cell: GridCell, // doesn't use Material UI
  SkeletonCell: GridSkeletonCell, // doesn't use Material UI
  ColumnMenu: GridColumnMenu,
  ErrorOverlay: GridErrorOverlay, // doesn't use Material UI
  Footer: GridFooter, // doesn't use Material UI
  Header: GridHeader, // doesn't use Material UI
  PreferencesPanel: GridPreferencesPanel, // doesn't use Material UI
  NoResultsOverlay: GridNoResultsOverlay, // doesn't use Material UI
  NoRowsOverlay: GridNoRowsOverlay, // doesn't use Material UI
  FilterPanel: GridFilterPanel,
  ColumnsPanel: GridColumnsPanel,
  Panel: GridPanel,
  Row: GridRow,
};
