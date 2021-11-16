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
   * @default Checkbox
   */
  BaseCheckbox: React.JSXElementConstructor<any>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   * @default GridColumnMenu
   */
  ColumnMenu: React.JSXElementConstructor<any>;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   * @default ErrorOverlay
   */
  ErrorOverlay: React.JSXElementConstructor<any>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   * @default GridFooter
   */
  Footer: React.JSXElementConstructor<any>;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot.
   * @default GridHeader
   */
  Header: React.JSXElementConstructor<any>; // TODO remove.
  /**
   * Toolbar component rendered inside the Header component.
   * @default null
   */
  Toolbar: React.JSXElementConstructor<any> | null;
  /**
   * PreferencesPanel component rendered inside the Header component.
   * @default GridPreferencesPanel
   */
  PreferencesPanel: React.JSXElementConstructor<any>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   * @default GridLoadingOverlay
   */
  LoadingOverlay: React.JSXElementConstructor<any>;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   * @default GridNoResultsOverlay
   */
  NoResultsOverlay: React.JSXElementConstructor<any>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   * @default GridNoRowsOverlay
   */
  NoRowsOverlay: React.JSXElementConstructor<any>;
  /**
   * Pagination component rendered in the grid footer by default.
   * @default Pagination
   */
  Pagination: React.JSXElementConstructor<any> | null;
  /**
   * Filter panel component rendered when clicking the filter button.
   * @default GridFilterPanel
   */
  FilterPanel: React.JSXElementConstructor<any>;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   * @default GridColumnsPanel
   */
  ColumnsPanel: React.JSXElementConstructor<any>;
  /**
   * Panel component wrapping the filters and columns panels.
   * @default GridPanel
   */
  Panel: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each row.
   */
  Row: React.JSXElementConstructor<any>;
}
