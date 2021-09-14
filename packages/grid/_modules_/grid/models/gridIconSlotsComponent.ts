import * as React from 'react';

/**
 * Set of icons used in the grid component UI.
 */
export interface GridIconSlotsComponent {
  /**
   * Icon displayed on the boolean cell to represent the true value.
   */
  BooleanCellTrueIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the boolean cell to represent the false value.
   */
  BooleanCellFalseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the side of the column header title to display the filter input component.
   */
  ColumnMenuIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the open filter button present in the toolbar by default.
   */
  OpenFilterButtonIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the column header menu to show that a filter has been applied to the column.
   */
  ColumnFilteredIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the column menu selector tab.
   */
  ColumnSelectorIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the side of the column header title when unsorted.
   */
  ColumnUnsortedIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed on the side of the column header title when sorted in ascending order.
   */
  ColumnSortedAscendingIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed on the side of the column header title when sorted in descending order.
   */
  ColumnSortedDescendingIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed in between two column headers that allows to resize the column header.
   */
  ColumnResizeIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the compact density option in the toolbar.
   */
  DensityCompactIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the standard density option in the toolbar.
   */
  DensityStandardIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the "comfortable" density option in the toolbar.
   */
  DensityComfortableIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the open export button present in the toolbar by default.
   */
  ExportIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the `actions` column type to open the menu.
   */
  MoreActionsIcon: React.JSXElementConstructor<any>;
}
