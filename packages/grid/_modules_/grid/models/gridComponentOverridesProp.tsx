import * as React from 'react';
import { GridColumnHeaderMenuItemProps } from '../components/menu/columnMenu/GridColumnHeaderMenu';
import { ComponentProps } from './params';

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridComponentOverridesProp {
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination?: React.ElementType<ComponentProps>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay?: React.ElementType<ComponentProps>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay?: React.ElementType<ComponentProps>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer?: React.ElementType<ComponentProps>;
  /**
   * Header component rendered above the grid column header bar.
   */
  Header?: React.ElementType<ComponentProps>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay?: React.ElementType<ComponentProps>;
  /**
   * ColumnMenu component rendered by clicking on the 3 dots icon in column headers.
   */
  ColumnMenu?: React.ElementType<ComponentProps & GridColumnHeaderMenuItemProps>;
}
