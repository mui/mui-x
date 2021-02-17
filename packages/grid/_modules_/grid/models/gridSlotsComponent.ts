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
} from '../components/icons/index';
import { GridLoadingOverlay } from '../components/GridLoadingOverlay';
import { GridColumnMenu, GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenu';
import { GridNoRowsOverlay } from '../components/GridNoRowsOverlay';
import { GridPagination } from '../components/GridPagination';
import { GridColumnsPanel } from '../components/panel/GridColumnsPanel';
import { GridFilterPanel } from '../components/panel/filterPanel/GridFilterPanel';
import { GridPanel, GridPanelProps } from '../components/panel/GridPanel';
import { ApiRefComponentsProperty } from './api/componentsApi';
import { GridIconSlotsComponent } from './gridIconSlotsComponent';
import { BaseComponentProps } from './params/baseComponentProps';

export type ColumnMenuProps = BaseComponentProps & GridColumnMenuProps;

/**
 * Grid components React prop interface containing all the overridable components.
 *
 */
export interface GridSlotsComponent extends GridIconSlotsComponent {
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   */
  ColumnMenu?: React.ElementType<ColumnMenuProps>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay?: React.ElementType<BaseComponentProps & ErrorOverlayProps>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer?: React.ElementType<BaseComponentProps>;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot. TODO remove.
   */
  Header?: React.ElementType<BaseComponentProps>;
  /**
   * Toolbar component rendered inside the Header component.
   */
  Toolbar?: React.ElementType<BaseComponentProps>;
  /**
   * PreferencesPanel component rendered inside the Header component.
   */
  PreferencesPanel?: React.ElementType<BaseComponentProps>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay?: React.ElementType<BaseComponentProps>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay?: React.ElementType<BaseComponentProps>;
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination?: React.ElementType<BaseComponentProps>;
  /**
   * Filter panel component rendered when clicking the filter button.
   */
  FilterPanel?: React.ElementType<BaseComponentProps>;
  /**
   * Columns panel component rendered when clicking the columns button.
   */
  ColumnsPanel?: React.ElementType<BaseComponentProps>;
  /**
   * Panel component wrapping the filters and columns panels.
   */
  Panel?: React.ElementType<BaseComponentProps & GridPanelProps>;
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
};

export const DEFAULT_GRID_SLOTS_COMPONENTS: ApiRefComponentsProperty = {
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
