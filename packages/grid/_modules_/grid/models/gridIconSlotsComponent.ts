import * as React from 'react';

/**
 * Set of icons used in the grid component UI.
 */
export interface GridIconSlotsComponent {
  /**
   * Icon displayed on the boolean cell to represent the true value.
   * @default GridCheckIcon
   */
  BooleanCellTrueIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the boolean cell to represent the false value.
   * @default GridCloseIcon
   */
  BooleanCellFalseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the side of the column header title to display the filter input component.
   * @default GridTripleDotsVerticalIcon
   */
  ColumnMenuIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the open filter button present in the toolbar by default.
   * @default GridFilterListIcon
   */
  OpenFilterButtonIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the column header menu to show that a filter has been applied to the column.
   * @default GridFilterAltIcon
   */
  ColumnFilteredIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the column menu selector tab.
   * @default GridColumnIcon
   */
  ColumnSelectorIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the side of the column header title when unsorted.
   * @default GridColumnUnsortedIcon
   */
  ColumnUnsortedIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed on the side of the column header title when sorted in ascending order.
   * @default GridArrowUpwardIcon
   */
  ColumnSortedAscendingIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed on the side of the column header title when sorted in descending order.
   * @default GridArrowDownwardIcon
   */
  ColumnSortedDescendingIcon: React.JSXElementConstructor<any> | null;
  /**
   * Icon displayed in between two column headers that allows to resize the column header.
   * @default GridSeparatorIcon
   */
  ColumnResizeIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the compact density option in the toolbar.
   * @default GridViewHeadlineIcon
   */
  DensityCompactIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the standard density option in the toolbar.
   * @default GridTableRowsIcon
   */
  DensityStandardIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the "comfortable" density option in the toolbar.
   * @default GridViewStreamIcon
   */
  DensityComfortableIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the open export button present in the toolbar by default.
   * @default GridSaveAltIcon
   */
  ExportIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the `actions` column type to open the menu.
   * @default GridMoreVertIcon
   */
  MoreActionsIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the tree data toggling column when the children are collapsed
   */
  TreeDataExpandIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the tree data toggling column when the children are expanded
   */
  TreeDataCollapseIcon: React.JSXElementConstructor<any>;
}
