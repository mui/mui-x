import * as React from 'react';
import { ComponentParams } from './params';

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridComponentOverridesProp {
  /**
   * pagination component rendered in the grid footer by default
   */
  pagination?: React.ElementType<ComponentParams>;
  /**
   * loadingOverlay component rendered when the grid is in a loading state
   */
  loadingOverlay?: React.ElementType<ComponentParams>;
  /**
   * noRowsOverlay component rendered when the grid has no rows
   */
  noRowsOverlay?: React.ElementType<ComponentParams>;
  /**
   * footer component rendered at the bottom of the grid viewport
   */
  footer?: React.ElementType<ComponentParams>;
  /**
   * header component rendered above the grid column header bar
   */
  header?: React.ElementType<ComponentParams>;
}
