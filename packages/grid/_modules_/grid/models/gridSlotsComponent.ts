import * as React from 'react';
import { ErrorOverlay, ErrorOverlayProps } from '../components/ErrorOverlay';
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
} from '../components/icons/index';
import { GridLoadingOverlay } from '../components/GridLoadingOverlay';
import { GridColumnMenu, GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenu';
import { GridNoRowsOverlay } from '../components/GridNoRowsOverlay';
import { GridPagination } from '../components/GridPagination';
import { GridColumnsPanel } from '../components/panel/GridColumnsPanel';
import { GridFilterPanel } from '../components/panel/filterPanel/GridFilterPanel';
import { GridPanel, GridPanelProps } from '../components/panel/GridPanel';
import { GridApiRefComponentsProperty } from './api/gridComponentsApi';
import { GridIconSlotsComponent } from './gridIconSlotsComponent';
import { GridToolbarContainerProps } from '../components/containers/GridToolbarContainer';
import { GridFooterContainerProps } from '../components/containers/GridFooterContainer';
import { GridOverlayProps } from '../components/containers/GridOverlay';

/**
 * Grid components React prop interface containing all the overridable components.
 *
 */
export interface GridSlotsComponent extends GridIconSlotsComponent {
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   */
  ColumnMenu?: React.ElementType<GridColumnMenuProps>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay?: React.ElementType<ErrorOverlayProps>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer?: React.ElementType<GridFooterContainerProps>;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot. TODO remove.
   */
  Header?: React.ElementType;
  /**
   * Toolbar component rendered inside the Header component.
   */
  Toolbar?: React.ElementType<GridToolbarContainerProps>;
  /**
   * PreferencesPanel component rendered inside the Header component.
   */
  PreferencesPanel?: React.ElementType;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay?: React.ElementType<GridOverlayProps>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay?: React.ElementType<GridOverlayProps>;
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination?: React.ElementType;
  /**
   * Filter panel component rendered when clicking the filter button.
   */
  FilterPanel?: React.ElementType;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   */
  ColumnsPanel?: React.ElementType;
  /**
   * Panel component wrapping the filters and columns panels.
   */
  Panel?: React.ElementType<GridPanelProps>;
}

export const DEFAULT_GRID_SLOTS_ICONS: GridIconSlotsComponent = {
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
  ColumnMenu: GridColumnMenu,
  ColumnsPanel: GridColumnsPanel,
  ErrorOverlay,
  FilterPanel: GridFilterPanel,
  Footer: GridFooter,
  Header: GridHeader,
  PreferencesPanel: GridPreferencesPanel,
  LoadingOverlay: GridLoadingOverlay,
  NoRowsOverlay: GridNoRowsOverlay,
  Pagination: GridPagination,
  Panel: GridPanel,
};
