import * as React from 'react';

/**
 * Set of icons used in the grid component UI.
 */
export interface GridIconSlotsComponent {
  /**
   * Icon displayed on the side of the column header title to display the filter input component.
   */
  ColumnMenuIcon?: React.ElementType;
  /**
   * Icon displayed on the open filter button present in the toolbar by default
   */
  OpenFilterButtonIcon?: React.ElementType;
  /**
   * Icon displayed on the column header menu to show that a filer has been applied to the column.
   */
  ColumnFilteredIcon?: React.ElementType;
  /**
   * Icon displayed on the column menu selector tab.
   */
  ColumnSelectorIcon?: React.ElementType;
  /**
   * Icon displayed on the side of the column header title when sorted in Ascending order.
   */
  ColumnSortedAscendingIcon?: React.ElementType;
  /**
   * Icon displayed on the side of the column header title when sorted in Descending order.
   */
  ColumnSortedDescendingIcon?: React.ElementType;
  /**
   * Icon displayed in between two column headers that allows to resize the column header.
   */
  ColumnResizeIcon?: React.ElementType;
  /**
   * Icon displayed on the compact density option in the toolbar.
   */
  DensityCompactIcon?: React.ElementType;
  /**
   * Icon displayed on the standard density option in the toolbar.
   */
  DensityStandardIcon?: React.ElementType;
  /**
   * Icon displayed on the comfortable density option in the toolbar.
   */
  DensityComfortableIcon?: React.ElementType;
}
