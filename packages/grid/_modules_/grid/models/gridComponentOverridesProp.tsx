import * as React from 'react';
import { ComponentProps } from './params';

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridComponentOverridesProp {
  /**
   * Pagination component rendered in the grid footer by default.
   */
  pagination?: React.ElementType<ComponentProps>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  loadingOverlay?: React.ElementType<ComponentProps>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  noRowsOverlay?: React.ElementType<ComponentProps>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  footer?: React.ElementType<ComponentProps>;
  /**
   * Header component rendered above the grid column header bar.
   */
  header?: React.ElementType<ComponentProps>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  errorOverlay?: React.ElementType<ComponentProps>;
}
