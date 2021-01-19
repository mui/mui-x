import * as React from 'react';
import { ErrorOverlay, ErrorOverlayProps } from '../components/ErrorOverlay';
import { GridFooter, GridFooterProps } from '../components/GridFooter';
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
import {
  GridColumnHeaderMenuItems,
  GridColumnHeaderMenuItemsProps,
} from '../components/menu/columnMenu/GridColumnHeaderMenuItems';
import { NoRowsOverlay } from '../components/NoRowsOverlay';
import { Pagination } from '../components/Pagination';
import { GridToolbar } from '../components/toolbar/GridToolbar';
import { GridIconSlotsComponent } from './gridIconSlotsComponent';
import { BaseComponentProps } from './params/baseComponentProps';

export type ColumnMenuProps = BaseComponentProps & GridColumnHeaderMenuItemsProps;

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
  Footer?: React.ElementType<BaseComponentProps & GridFooterProps>;
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

export const DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...DEFAULT_SLOTS_ICONS,
  ColumnMenu: GridColumnHeaderMenuItems,
  ErrorOverlay,
  Footer: GridFooter,
  Header: GridToolbar,
  LoadingOverlay,
  NoRowsOverlay,
  Pagination,
};

export interface GridSlotsComponentProps {
  columnMenu?: any;
  errorOverlay?: any;
  footer?: any;
  header?: any;
  loadingOverlay?: any;
  noRowsOverlay?: any;
  pagination?: any;
}
