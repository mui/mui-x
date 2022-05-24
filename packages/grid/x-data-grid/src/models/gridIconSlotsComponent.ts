import * as React from 'react';

/**
 * Set of icons used in the grid component UI.
 * TODO: Differentiate community and pro interface
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
   * @default GridKeyboardArrowRight
   */
  TreeDataExpandIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the tree data toggling column when the children are expanded
   * @default GridExpandMoreIcon
   */
  TreeDataCollapseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the grouping column when the children are collapsed
   * @default GridKeyboardArrowRight
   */
  GroupingCriteriaExpandIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the grouping column when the children are expanded
   * @default GridExpandMoreIcon
   */
  GroupingCriteriaCollapseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the detail panel toggle column when collapsed.
   * @default GridAddIcon
   */
  DetailPanelExpandIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the detail panel toggle column when expanded.
   * @default GridRemoveIcon
   */
  DetailPanelCollapseIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed for deleting the filter from filter Panel.
   * @default GridCloseIcon
   */
  FilterPanelDeleteIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the `reorder` column type to reorder a row.
   * @default GridDragIcon
   */
  RowReorderIcon: React.JSXElementConstructor<any>;
  /**
   * Icon displayed on the quick filter input.
   * @default GridSearchIcon
   */
  QuickFilterIcon: React.JSXElementConstructor<any>;
}
