import * as React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import { ErrorOverlay } from '../components/ErrorOverlay';
import { GridFooter } from '../components/GridFooter';
import { GridHeader } from '../components/GridHeader';
import { GridPreferencesPanel } from '../components/panel/GridPreferencesPanel';
import {
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridColumnIcon,
  GridFilterAltIcon,
  GridFilterListIcon,
  GridSeparatorIcon,
  GridTableRowsIcon,
  GridTripleDotsVerticalIcon,
  GridViewHeadlineIcon,
  GridViewStreamIcon,
  GridSaveAltIcon,
  GridCloseIcon,
  GridCheckIcon,
} from '../components/icons/index';
import { GridLoadingOverlay } from '../components/GridLoadingOverlay';
import { GridColumnMenu } from '../components/menu/columnMenu/GridColumnMenu';
import { GridNoRowsOverlay } from '../components/GridNoRowsOverlay';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import { GridPagination } from '../components/GridPagination';
import { GridColumnsPanel } from '../components/panel/GridColumnsPanel';
import { GridFilterPanel } from '../components/panel/filterPanel/GridFilterPanel';
import { GridPanel } from '../components/panel/GridPanel';
import { GridApiRefComponentsProperty } from './api/gridComponentsApi';
import { GridIconSlotsComponent } from './gridIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components.
 *
 */
export interface GridSlotsComponent extends GridIconSlotsComponent {
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   */
  Checkbox?: React.JSXElementConstructor<any>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   */
  ColumnMenu?: React.JSXElementConstructor<any>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay?: React.JSXElementConstructor<any>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer?: React.JSXElementConstructor<any>;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot. TODO remove.
   */
  Header?: React.JSXElementConstructor<any>;
  /**
   * Toolbar component rendered inside the Header component.
   */
  Toolbar?: React.JSXElementConstructor<any>;
  /**
   * PreferencesPanel component rendered inside the Header component.
   */
  PreferencesPanel?: React.JSXElementConstructor<any>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay?: React.JSXElementConstructor<any>;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   */
  NoResultsOverlay?: React.JSXElementConstructor<any>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay?: React.JSXElementConstructor<any>;
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination?: React.JSXElementConstructor<any>;
  /**
   * Filter panel component rendered when clicking the filter button.
   */
  FilterPanel?: React.JSXElementConstructor<any>;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   */
  ColumnsPanel?: React.JSXElementConstructor<any>;
  /**
   * Panel component wrapping the filters and columns panels.
   */
  Panel?: React.JSXElementConstructor<any>;
}

export const DEFAULT_GRID_SLOTS_ICONS: GridIconSlotsComponent = {
  BooleanCellTrueIcon: GridCheckIcon,
  BooleanCellFalseIcon: GridCloseIcon,
  OpenFilterButtonIcon: GridFilterListIcon,
  ColumnFilteredIcon: GridFilterAltIcon,
  ColumnSelectorIcon: GridColumnIcon,
  ColumnMenuIcon: GridTripleDotsVerticalIcon,
  ColumnSortedAscendingIcon: GridArrowUpwardIcon,
  ColumnSortedDescendingIcon: GridArrowDownwardIcon,
  ColumnResizeIcon: GridSeparatorIcon,
  DensityCompactIcon: GridViewHeadlineIcon,
  DensityStandardIcon: GridTableRowsIcon,
  DensityComfortableIcon: GridViewStreamIcon,
  ExportIcon: GridSaveAltIcon,
};

export const DEFAULT_GRID_SLOTS_COMPONENTS: GridApiRefComponentsProperty = {
  ...DEFAULT_GRID_SLOTS_ICONS,
  Checkbox: MUICheckbox,
  ColumnMenu: GridColumnMenu,
  ColumnsPanel: GridColumnsPanel,
  ErrorOverlay,
  FilterPanel: GridFilterPanel,
  Footer: GridFooter,
  Header: GridHeader,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoResultsOverlay: GridNoResultsOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  Pagination: GridPagination,
  Panel: GridPanel,
};
