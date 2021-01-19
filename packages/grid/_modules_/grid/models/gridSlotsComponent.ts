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
import { BaseComponentProps } from './params/baseComponentProps';

export type ColumnMenuProps = BaseComponentProps & GridColumnHeaderMenuItemsProps;

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent extends IconSlotsComponent {
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

export const DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ColumnMenu: GridColumnHeaderMenuItems,
  ErrorOverlay,
  Footer: GridFooter,
  Header: GridToolbar,
  LoadingOverlay,
  NoRowsOverlay,
  Pagination,

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

export interface GridSlotsComponentProps {
  columnMenu?: any;
  errorOverlay?: any;
  footer?: any;
  header?: any;
  loadingOverlay?: any;
  noRowsOverlay?: any;
  pagination?: any;
}

/**
 * Set of icons used in the grid component UI.
 */
export interface IconSlotsComponent {
  /**
   * Icon displayed on the side of the column header title to display the filter input component.
   */
  ColumnMenuIcon?: React.ElementType;
  /**
   * Icon displayed on the open filter button present in the toolbar by default
   */
  OpenFilterButtonIcon?: React.ElementType;
  /**
   * Icon displayed on the column header menu to show that a filer has been applied to the column.
   */
  ColumnFilteredIcon?: React.ElementType;
  /**
   * Icon displayed on the column menu selector tab.
   */
  ColumnSelectorIcon?: React.ElementType;
  /**
   * Icon displayed on the side of the column header title when sorted in Ascending order.
   */
  ColumnSortedAscendingIcon?: React.ElementType;
  /**
   * Icon displayed on the side of the column header title when sorted in Descending order.
   */
  ColumnSortedDescendingIcon?: React.ElementType;
  /**
   * Icon displayed in between two column headers that allows to resize the column header.
   */
  ColumnResizeIcon?: React.ElementType<{ className: string }>;
  /**
   * Icon displayed on the compact density option in the toolbar.
   */
  DensityCompactIcon?: React.ElementType;
  /**
   * Icon displayed on the standard density option in the toolbar.
   */
  DensityStandardIcon?: React.ElementType;
  /**
   * Icon displayed on the comfortable density option in the toolbar.
   */
  DensityComfortableIcon?: React.ElementType;
}
