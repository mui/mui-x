import * as React from 'react';
import { GridFooter, GridFooterProps } from '../components/GridFooter';
import { ErrorOverlay, ErrorOverlayProps } from '../components/ErrorOverlay';
import {
  GridColumnHeaderMenuItemsProps,
  GridColumnHeaderMenuItems,
} from '../components/menu/columnMenu/GridColumnHeaderMenuItems';
import { NoRowsOverlay } from '../components/NoRowsOverlay';
import { Pagination } from '../components/Pagination';
import { GridToolbar } from '../components/toolbar/GridToolbar';
import { BaseComponentProps } from './params/componentParams';
import { LoadingOverlay } from '../components/LoadingOverlay';

export type ColumnMenuProps = BaseComponentProps & GridColumnHeaderMenuItemsProps;

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent {
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
