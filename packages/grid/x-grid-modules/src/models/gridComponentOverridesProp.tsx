import * as React from 'react';
import { ComponentParams } from './params';

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridComponentOverridesProp {
  /**
   * Pagination component rendered in the grid footer by default.
   */
  pagination?: React.ElementType<ComponentParams>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  loadingOverlay?: React.ElementType<ComponentParams>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  noRowsOverlay?: React.ElementType<ComponentParams>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  footer?: React.ElementType<ComponentParams>;
  /**
   * Header component rendered above the grid column header bar.
   */
  header?: React.ElementType<ComponentParams>;
}
