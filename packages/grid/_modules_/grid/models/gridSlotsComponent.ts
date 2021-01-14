import * as React from 'react';
import { GridColumnHeaderMenuItemProps } from '../components/menu/columnMenu/GridColumnHeaderMenu';
import { BaseComponentProps } from './params/componentParams';

export type ColumnMenuProps = BaseComponentProps & GridColumnHeaderMenuItemProps;

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent {
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination?: React.ElementType<BaseComponentProps>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay?: React.ElementType<BaseComponentProps>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay?: React.ElementType<BaseComponentProps>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer?: React.ElementType<BaseComponentProps>;
  /**
   * Header component rendered above the grid column header bar.
   */
  Header?: React.ElementType<BaseComponentProps>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay?: React.ElementType<BaseComponentProps>;
  /**
   * ColumnMenu component rendered by clicking on the 3 dots icon in column headers.
   */
  ColumnMenu?: React.ElementType<ColumnMenuProps>;
}
