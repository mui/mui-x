import * as React from 'react';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridIconSlotsComponent } from './gridIconSlotsComponent';

export interface GridBaseSlots {
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default Checkbox
   */
  BaseCheckbox: React.JSXElementConstructor<any>;
  /**
   * The custom Chip component used in the grid.
   * @default Chip
   */
  BaseChip: React.JSXElementConstructor<any>;
  /**
   * The custom InputAdornment component used in the grid.
   * @default InputAdornment
   */
  BaseInputAdornment: React.JSXElementConstructor<any>;
  /**
   * The custom TextField component used in the grid.
   * @default TextField
   */
  BaseTextField: React.JSXElementConstructor<any>;
  /**
   * The custom FormControl component used in the grid.
   * @default FormControl
   */
  BaseFormControl: React.JSXElementConstructor<any>;
  /**
   * The custom Select component used in the grid.
   * @default Select
   */
  BaseSelect: React.JSXElementConstructor<any>;
  /**
   * The custom Switch component used in the grid.
   * @default Switch
   */
  BaseSwitch: React.JSXElementConstructor<any>;
  /**
   * The custom Button component used in the grid.
   * @default Button
   */
  BaseButton: React.JSXElementConstructor<any>;
  /**
   * The custom IconButton component used in the grid.
   * @default IconButton
   */
  BaseIconButton: React.JSXElementConstructor<any>;
  /**
   * The custom Tooltip component used in the grid.
   * @default Tooltip
   */
  BaseTooltip: React.JSXElementConstructor<any>;
  /**
   * The custom Popper component used in the grid.
   * @default Popper
   */
  BasePopper: React.JSXElementConstructor<any>;
  /**
   * The custom InputLabel component used in the grid.
   * @default InputLabel
   */
  BaseInputLabel: React.JSXElementConstructor<any>;
  /**
   * The custom SelectOption component used in the grid.
   * @default MenuItem
   */
  BaseSelectOption: React.JSXElementConstructor<any>;
}

// TODO v7: camelCase GridSlotsComponent, the `componenets` prop is going away.

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent extends GridBaseSlots, GridIconSlotsComponent {
  /**
   * The custom Chip component used in the grid.
   * @default Chip
   */
  BaseChip: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each cell.
   * @default GridCell
   */
  Cell: React.JSXElementConstructor<any>;
  /**
   * Component rendered for each skeleton cell.
   * @default GridSkeletonCell
   */
  SkeletonCell: React.JSXElementConstructor<any>;
  /**
   * Filter icon component rendered in each column header.
   * @default GridColumnHeaderFilterIconButton
   */
  ColumnHeaderFilterIconButton: React.JSXElementConstructor<any>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   * @default GridColumnMenu
   */
  ColumnMenu: React.JSXElementConstructor<any>;
  /**
   * Component responsible for rendering the column headers.
   * @default DataGridColumnHeaders
   */
  ColumnHeaders: React.JSXElementConstructor<any>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   * @default GridFooter
   */
  Footer: React.JSXElementConstructor<any>;
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
   * @default GridRow
   */
  Row: React.JSXElementConstructor<any>;
}

export interface UncapitalizedGridSlotsComponent
  extends UncapitalizeObjectKeys<GridSlotsComponent> {}
