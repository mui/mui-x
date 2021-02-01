import * as React from 'react';
import { ErrorOverlay, ErrorOverlayProps } from '../components/ErrorOverlay';
import { GridFooter } from '../components/GridFooter';
import { GridHeader } from '../components/GridHeader';
import {
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  ColumnIcon,
  FilterAltIcon,
  FilterListIcon,
  SeparatorIcon,
  TableRowsIcon,
  TripleDotsVerticalIcon,
  ViewHeadlineIcon,
  ViewStreamIcon,
} from '../components/icons/index';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { GridColumnMenu, GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenu';
import { NoRowsOverlay } from '../components/NoRowsOverlay';
import { Pagination } from '../components/Pagination';
import { ColumnsPanel } from '../components/panel/ColumnsPanel';
import { FilterPanel } from '../components/panel/filterPanel/FilterPanel';
import { Panel, PanelProps } from '../components/panel/Panel';
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
   */
  Header?: React.ElementType<BaseComponentProps>;
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
  Panel?: React.ElementType<BaseComponentProps & PanelProps>;
}

export const DEFAULT_SLOTS_ICONS: GridIconSlotsComponent = {
  OpenFilterButtonIcon: FilterListIcon,
  ColumnFilteredIcon: FilterAltIcon,
  ColumnSelectorIcon: ColumnIcon,
  ColumnMenuIcon: TripleDotsVerticalIcon,
  ColumnSortedAscendingIcon: ArrowUpwardIcon,
  ColumnSortedDescendingIcon: ArrowDownwardIcon,
  ColumnResizeIcon: SeparatorIcon,
  DensityCompactIcon: ViewHeadlineIcon,
  DensityStandardIcon: TableRowsIcon,
  DensityComfortableIcon: ViewStreamIcon,
};

export const DEFAULT_SLOTS_COMPONENTS: ApiRefComponentsProperty = {
  ...DEFAULT_SLOTS_ICONS,
  ColumnMenu: GridColumnMenu,
  ColumnsPanel,
  ErrorOverlay,
  FilterPanel,
  Footer: GridFooter,
  Header: GridHeader,
  LoadingOverlay,
  NoRowsOverlay,
  Pagination,
  Panel,
};
