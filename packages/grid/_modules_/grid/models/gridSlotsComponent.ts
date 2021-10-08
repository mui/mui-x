import * as React from 'react';
import { GridIconSlotsComponent } from './gridIconSlotsComponent';

/**
 * Grid components React prop interface containing all the overridable components.
 *
 */
export interface GridSlotsComponent extends GridIconSlotsComponent {
  /**
   * Component rendered for each cell.
   */
  Cell: React.JSXElementConstructor<any>;
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   */
  Checkbox: React.JSXElementConstructor<any>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   */
  ColumnMenu: React.JSXElementConstructor<any>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay: React.JSXElementConstructor<any>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer: React.JSXElementConstructor<any>;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot. TODO remove.
   */
  Header: React.JSXElementConstructor<any>;
  /**
   * Toolbar component rendered inside the Header component.
   */
  Toolbar: React.JSXElementConstructor<any> | null;
  /**
   * PreferencesPanel component rendered inside the Header component.
   */
  PreferencesPanel: React.JSXElementConstructor<any>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay: React.JSXElementConstructor<any>;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   */
  NoResultsOverlay: React.JSXElementConstructor<any>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay: React.JSXElementConstructor<any>;
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination: React.JSXElementConstructor<any> | null;
  /**
   * Filter panel component rendered when clicking the filter button.
   */
  FilterPanel: React.JSXElementConstructor<any>;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   */
  ColumnsPanel: React.JSXElementConstructor<any>;
  /**
   * Panel component wrapping the filters and columns panels.
   */
  Panel: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each row.
   */
  Row: React.JSXElementConstructor<any>;
}
