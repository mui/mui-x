import * as React from 'react';
import { GridIconSlotsComponent } from '../gridIconSlotsComponent';
import { GridSlotsComponentsProps } from '../gridSlotsComponentsProps';

export interface GridApiRefComponentsProperty extends GridIconSlotsComponent {
  /**
   * The custom Checkbox component used in the grid.
   */
  Checkbox: React.ElementType;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   */
  ColumnMenu: React.ElementType;
  /**
   * Error overlay component rendered above the grid when an error is caught.
   */
  ErrorOverlay: React.ElementType;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   */
  Footer: React.ElementType;
  /**
   * Header component rendered above the grid column header bar.
   * Prefer using the `Toolbar` slot. You should never need to use this slot. TODO remove.
   */
  Header: React.ElementType;
  /**
   * Toolbar component rendered inside the Header component.
   */
  Toolbar?: React.ElementType;
  /**
   * PreferencesPanel component rendered inside the Header component.
   */
  PreferencesPanel: React.ElementType;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   */
  LoadingOverlay: React.ElementType;
  /**
   * No rows overlay component rendered when the grid has no rows.
   */
  NoRowsOverlay: React.ElementType;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   */
  NoResultsOverlay: React.ElementType;
  /**
   * Pagination component rendered in the grid footer by default.
   */
  Pagination: React.ElementType;
  /**
   * Filter panel component rendered when clicking the filter button.
   */
  FilterPanel: React.ElementType;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   */
  ColumnsPanel: React.ElementType;
  /**
   * Panel component wrapping the filters and columns panels.
   */
  Panel: React.ElementType;
}

export interface GridComponentsApi {
  /**
   * The set of overridable components used in the grid.
   */
  components: GridApiRefComponentsProperty;
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
}
