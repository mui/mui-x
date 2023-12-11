import * as React from 'react';
import type { GridIconSlotsComponent } from './gridIconSlotsComponent';

export interface GridBaseSlots {
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default Checkbox
   */
  baseCheckbox: React.JSXElementConstructor<any>;
  /**
   * The custom Chip component used in the grid.
   * @default Chip
   */
  baseChip: React.JSXElementConstructor<any>;
  /**
   * The custom InputAdornment component used in the grid.
   * @default InputAdornment
   */
  baseInputAdornment: React.JSXElementConstructor<any>;
  /**
   * The custom TextField component used in the grid.
   * @default TextField
   */
  baseTextField: React.JSXElementConstructor<any>;
  /**
   * The custom FormControl component used in the grid.
   * @default FormControl
   */
  baseFormControl: React.JSXElementConstructor<any>;
  /**
   * The custom Select component used in the grid.
   * @default Select
   */
  baseSelect: React.JSXElementConstructor<any>;
  /**
   * The custom Switch component used in the grid.
   * @default Switch
   */
  baseSwitch: React.JSXElementConstructor<any>;
  /**
   * The custom Button component used in the grid.
   * @default Button
   */
  baseButton: React.JSXElementConstructor<any>;
  /**
   * The custom IconButton component used in the grid.
   * @default IconButton
   */
  baseIconButton: React.JSXElementConstructor<any>;
  /**
   * The custom Tooltip component used in the grid.
   * @default Tooltip
   */
  baseTooltip: React.JSXElementConstructor<any>;
  /**
   * The custom Popper component used in the grid.
   * @default Popper
   */
  basePopper: React.JSXElementConstructor<any>;
  /**
   * The custom InputLabel component used in the grid.
   * @default InputLabel
   */
  baseInputLabel: React.JSXElementConstructor<any>;
  /**
   * The custom SelectOption component used in the grid.
   * @default MenuItem
   */
  baseSelectOption: React.JSXElementConstructor<any>;
}

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent extends GridBaseSlots, GridIconSlotsComponent {
  /**
   * The custom Chip component used in the grid.
   * @default Chip
   */
  baseChip: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each cell.
   * @default GridCell
   */
  cell: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each skeleton cell.
   * @default GridSkeletonCell
   */
  skeletonCell: React.JSXElementConstructor<any>;
  /**
   * Filter icon component rendered in each column header.
   * @default GridColumnHeaderFilterIconButton
   */
  columnHeaderFilterIconButton: React.JSXElementConstructor<any>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   * @default GridColumnMenu
   */
  columnMenu: React.JSXElementConstructor<any>;
  /**
   * Component responsible for rendering the column headers.
   * @default DataGridColumnHeaders
   */
  columnHeaders: React.JSXElementConstructor<any>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   * @default GridFooter
   */
  footer: React.JSXElementConstructor<any>;
  /**
   * Row count component rendered in the footer
   * @default GridRowCount
   */
  footerRowCount: React.JSXElementConstructor<any>;
  /**
   * Toolbar component rendered inside the Header component.
   * @default null
   */
  toolbar: React.JSXElementConstructor<any> | null;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   * @default GridLoadingOverlay
   */
  loadingOverlay: React.JSXElementConstructor<any>;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   * @default GridNoResultsOverlay
   */
  noResultsOverlay: React.JSXElementConstructor<any>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   * @default GridNoRowsOverlay
   */
  noRowsOverlay: React.JSXElementConstructor<any>;
  /**
   * Pagination component rendered in the grid footer by default.
   * @default Pagination
   */
  pagination: React.JSXElementConstructor<any> | null;
  /**
   * Filter panel component rendered when clicking the filter button.
   * @default GridFilterPanel
   */
  filterPanel: React.JSXElementConstructor<any>;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   * @default GridColumnsPanel
   */
  columnsPanel: React.JSXElementConstructor<any>;
  /**
   * Panel component wrapping the filters and columns panels.
   * @default GridPanel
   */
  panel: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each row.
   * @default GridRow
   */
  row: React.JSXElementConstructor<any>;
}
