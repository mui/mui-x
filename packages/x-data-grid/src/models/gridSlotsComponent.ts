import * as React from 'react';
import type { GridSlotProps } from './gridSlotsComponentsProps';
import type { GridIconSlotsComponent } from './gridIconSlotsComponent';

export type { GridSlotProps } from './gridSlotsComponentsProps';

export interface GridBaseSlots {
  /**
   * The custom Autocomplete component used in the grid for both header and cells.
   * @default Autocomplete
   */
  baseAutocomplete: React.JSXElementConstructor<GridSlotProps['baseAutocomplete']>;
  /**
   * The custom Badge component used in the grid for both header and cells.
   * @default Badge
   */
  baseBadge: React.JSXElementConstructor<GridSlotProps['baseBadge']>;
  /**
   * The custom Checkbox component used in the grid for both header and cells.
   * @default Checkbox
   */
  baseCheckbox: React.JSXElementConstructor<GridSlotProps['baseCheckbox']>;
  /**
   * The custom CircularProgress component used in the grid.
   * @default CircularProgress
   */
  baseCircularProgress: React.JSXElementConstructor<GridSlotProps['baseCircularProgress']>;
  /**
   * The custom Divider component used in the grid.
   * @default Divider
   */
  baseDivider: React.JSXElementConstructor<GridSlotProps['baseDivider']>;
  /**
   * The custom LinearProgress component used in the grid.
   * @default LinearProgress
   */
  baseLinearProgress: React.JSXElementConstructor<GridSlotProps['baseLinearProgress']>;
  /**
   * The custom MenuList component used in the grid.
   * @default MenuList
   */
  baseMenuList: React.JSXElementConstructor<GridSlotProps['baseMenuList']>;
  /**
   * The custom MenuItem component used in the grid.
   * @default MenuItem
   */
  baseMenuItem: React.JSXElementConstructor<GridSlotProps['baseMenuItem']>;
  /**
   * The custom TextField component used in the grid.
   * @default TextField
   */
  baseTextField: React.JSXElementConstructor<GridSlotProps['baseTextField']>;
  /**
   * The custom Select component used in the grid.
   * @default Select
   */
  baseSelect: React.JSXElementConstructor<GridSlotProps['baseSelect']>;
  /**
   * The custom Button component used in the grid.
   * @default Button
   */
  baseButton: React.JSXElementConstructor<GridSlotProps['baseButton']>;
  /**
   * The custom IconButton component used in the grid.
   * @default IconButton
   */
  baseIconButton: React.JSXElementConstructor<GridSlotProps['baseIconButton']>;
  /**
   * The custom Input component used in the grid.
   * @default Input
   */
  baseInput: React.JSXElementConstructor<GridSlotProps['baseInput']>;
  /**
   * The custom Tooltip component used in the grid.
   * @default Tooltip
   */
  baseTooltip: React.JSXElementConstructor<GridSlotProps['baseTooltip']>;
  /**
   * The custom Pagination component used in the grid.
   * @default Pagination
   */
  basePagination: React.JSXElementConstructor<GridSlotProps['basePagination']>;
  /**
   * The custom Popper component used in the grid.
   * @default Popper
   */
  basePopper: React.JSXElementConstructor<GridSlotProps['basePopper']>;
  /**
   * The custom SelectOption component used in the grid.
   * @default SelectOption
   */
  baseSelectOption: React.JSXElementConstructor<GridSlotProps['baseSelectOption']>;
  /**
   * The custom Skeleton component used in the grid.
   * @default Skeleton
   */
  baseSkeleton: React.JSXElementConstructor<GridSlotProps['baseSkeleton']>;
  /**
   * The custom Switch component used in the grid.
   * @default Switch
   */
  baseSwitch: React.JSXElementConstructor<GridSlotProps['baseSwitch']>;
}

/**
 * Grid components React prop interface containing all the overridable components.
 */
export interface GridSlotsComponent extends GridBaseSlots, GridIconSlotsComponent {
  /**
   * Component rendered for the bottom container.
   * @default GridBottomContainer
   */
  bottomContainer: React.JSXElementConstructor<GridSlotProps['bottomContainer']>;
  /**
   * Component rendered for each cell.
   * @default GridCell
   */
  cell: React.JSXElementConstructor<GridSlotProps['cell']>;
  /**
   * Component rendered for each skeleton cell.
   * @default GridSkeletonCell
   */
  skeletonCell: React.JSXElementConstructor<GridSlotProps['skeletonCell']>;
  /**
   * Filter icon component rendered in each column header.
   * @default GridColumnHeaderFilterIconButton
   */
  columnHeaderFilterIconButton: React.JSXElementConstructor<
    GridSlotProps['columnHeaderFilterIconButton']
  >;
  /**
   * Sort icon component rendered in each column header.
   * @default GridColumnHeaderSortIcon
   */
  columnHeaderSortIcon: React.JSXElementConstructor<GridSlotProps['columnHeaderSortIcon']>;
  /**
   * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
   * @default GridColumnMenu
   */
  columnMenu: React.JSXElementConstructor<GridSlotProps['columnMenu']>;
  /**
   * Component responsible for rendering the column headers.
   * @default GridColumnHeaders
   */
  columnHeaders: React.JSXElementConstructor<GridSlotProps['columnHeaders']>;
  /**
   * Component responsible for rendering the detail panels.
   * @default GridDetailPanels
   */
  detailPanels: React.JSXElementConstructor<GridSlotProps['detailPanels']>;
  /**
   * Footer component rendered at the bottom of the grid viewport.
   * @default GridFooter
   */
  footer: React.JSXElementConstructor<GridSlotProps['footer']>;
  /**
   * Row count component rendered in the footer
   * @default GridRowCount
   */
  footerRowCount: React.JSXElementConstructor<GridSlotProps['footerRowCount']>;
  /**
   * Toolbar component rendered in the grid header.
   */
  toolbar: React.JSXElementConstructor<GridSlotProps['toolbar']>;
  /**
   * Pinned rows container.
   * @ignore - do not document
   */
  pinnedRows: React.JSXElementConstructor<GridSlotProps['pinnedRows']>;
  /**
   * Loading overlay component rendered when the grid is in a loading state.
   * @default GridLoadingOverlay
   */
  loadingOverlay: React.JSXElementConstructor<GridSlotProps['loadingOverlay']>;
  /**
   * No results overlay component rendered when the grid has no results after filtering.
   * @default GridNoResultsOverlay
   */
  noResultsOverlay: React.JSXElementConstructor<GridSlotProps['noResultsOverlay']>;
  /**
   * No rows overlay component rendered when the grid has no rows.
   * @default GridNoRowsOverlay
   */
  noRowsOverlay: React.JSXElementConstructor<GridSlotProps['noRowsOverlay']>;
  /**
   * No columns overlay component rendered when the grid has no columns.
   * @default GridNoColumnsOverlay
   */
  noColumnsOverlay: React.JSXElementConstructor<GridSlotProps['noColumnsOverlay']>;
  /**
   * Pagination component rendered in the grid footer by default.
   * @default Pagination
   */
  pagination: React.JSXElementConstructor<GridSlotProps['pagination']> | null;
  /**
   * Filter panel component rendered when clicking the filter button.
   * @default GridFilterPanel
   */
  filterPanel: React.JSXElementConstructor<GridSlotProps['filterPanel']>;
  /**
   * GridColumns panel component rendered when clicking the columns button.
   * @default GridColumnsPanel
   */
  columnsPanel: React.JSXElementConstructor<GridSlotProps['columnsPanel']>;
  /**
   * Component used inside Grid Columns panel to manage columns.
   * @default GridColumnsManagement
   */
  columnsManagement: React.JSXElementConstructor<any>;
  /**
   * Panel component wrapping the filters and columns panels.
   * @default GridPanel
   */
  panel: React.JSXElementConstructor<GridSlotProps['panel']>;
  /**
   * Component rendered for each row.
   * @default GridRow
   */
  row: React.JSXElementConstructor<GridSlotProps['row']>;
}
