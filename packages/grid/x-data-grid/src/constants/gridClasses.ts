import { generateUtilityClasses, generateUtilityClass } from '@mui/material';

export interface GridClasses {
  /**
   * Styles applied to the root element of the cell with type="actions"
   */
  actionsCell: string;
  /**
   * Styles applied to the root element if `autoHeight={true}`.
   */
  autoHeight: string;
  /**
   * Styles applied to the icon of the boolean cell.
   */
  booleanCell: string;
  /**
   * Styles applied to the cell element if the cell is editable.
   */
  'cell--editable': string;
  /**
   * Styles applied to the cell element if the cell is in edit mode.
   */
  'cell--editing': string;
  /**
   * Styles applied to the cell element if `align="center"`.
   */
  'cell--textCenter': string;
  /**
   * Styles applied to the cell element if `align="left"`.
   */
  'cell--textLeft': string;
  /**
   * Styles applied to the cell element if `align="right"`.
   */
  'cell--textRight': string;
  /**
   * Styles applied to the cell element if the cell has a custom renderer.
   */
  'cell--withRenderer': string;
  /**
   * Styles applied to the cell element.
   */
  cell: string;
  /**
   * Styles applied to the element that wraps the cell content.
   */
  cellContent: string;
  /**
   * Styles applied to the cell checkbox element.
   */
  cellCheckbox: string;
  /**
   * Styles applied to the selection checkbox element.
   */
  checkboxInput: string;
  /**
   * Styles applied to the column header if `headerAlign="center"`.
   */
  'columnHeader--alignCenter': string;
  /**
   * Styles applied to the column header if `headerAlign="left"`.
   */
  'columnHeader--alignLeft': string;
  /**
   * Styles applied to the column header if `headerAlign="right"`.
   */
  'columnHeader--alignRight': string;
  /**
   * Styles applied to the floating column header element when it is dragged.
   */
  'columnHeader--dragging': string;
  /**
   * Styles applied to the column header if it is being dragged.
   */
  'columnHeader--moving': string;
  /**
   * Styles applied to the column header if the type of the column is `number`.
   */
  'columnHeader--numeric': string;
  /**
   * Styles applied to the column header if the column is sortable.
   */
  'columnHeader--sortable': string;
  /**
   * Styles applied to the column header if the column is sorted.
   */
  'columnHeader--sorted': string;
  /**
   * Styles applied to the column header if the column has a filter applied to it.
   */
  'columnHeader--filtered': string;
  /**
   * Styles applied to the column header element.
   */
  columnHeader: string;
  /**
   * Styles applied to the header checkbox cell element.
   */
  columnHeaderCheckbox: string;
  /**
   * Styles applied to the column header's draggable container element.
   */
  columnHeaderDraggableContainer: string;
  /**
   * Styles applied to the row's draggable placeholder element inside the special row reorder cell.
   */
  rowReorderCellPlaceholder: string;
  /**
   * Styles applied to the column headers wrapper if a column is being dragged.
   */
  columnHeaderDropZone: string;
  /**
   * Styles applied to the column header's title element;
   */
  columnHeaderTitle: string;
  /**
   * Styles applied to the column header's title container element.
   */
  columnHeaderTitleContainer: string;
  /**
   * Styles applied to the column header's title excepted buttons.
   */
  columnHeaderTitleContainerContent: string;
  /**
   * Styles applied to the column headers.
   */
  columnHeaders: string;
  /**
   * Styles applied to the column headers's inner element.
   */
  columnHeadersInner: string;
  /**
   * Styles applied to the column headers's inner element if there is a horizontal scrollbar.
   */
  'columnHeadersInner--scrollable': string;
  /**
   * Styles applied to the column header separator if the column is resizable.
   */
  'columnSeparator--resizable': string;
  /**
   * Styles applied to the column header separator if the column is being resized.
   */
  'columnSeparator--resizing': string;
  /**
   * Styles applied to the column header separator if the side is "left".
   */
  'columnSeparator--sideLeft': string;
  /**
   * Styles applied to the column header separator if the side is "right".
   */
  'columnSeparator--sideRight': string;
  /**
   * Styles applied to the column header separator element.
   */
  columnSeparator: string;
  /**
   * Styles applied to the columns panel element.
   */
  columnsPanel: string;
  /**
   * Styles applied to the columns panel row element.
   */
  columnsPanelRow: string;
  /**
   * Styles applied to the detail panel element.
   */
  detailPanel: string;
  /**
   * Styles applied to the detail panels wrapper element.
   */
  detailPanels: string;
  /**
   * Styles applied to the detail panel toggle cell element.
   */
  detailPanelToggleCell: string;
  /**
   * Styles applied to the detail panel toggle cell element if expanded.
   */
  'detailPanelToggleCell--expanded': string;
  /**
   * Styles applied to the panel element.
   */
  panel: string;
  /**
   * Styles applied to the panel header element.
   */
  panelHeader: string;
  /**
   * Styles applied to the panel wrapper element.
   */
  panelWrapper: string;
  /**
   * Styles applied to the panel content element.
   */
  panelContent: string;
  /**
   * Styles applied to the panel footer element.
   */
  panelFooter: string;
  /**
   * Styles applied to the paper element.
   */
  paper: string;
  /**
   * Styles applied to root of the boolean edit component.
   */
  editBooleanCell: string;
  /**
   * Styles applied to the root of the filter form component.
   */
  filterForm: string;
  /**
   * Styles applied to the delete icon of the filter form component.
   */
  filterFormDeleteIcon: string;
  /**
   * Styles applied to the link operator inout of the filter form component.
   */
  filterFormLinkOperatorInput: string;
  /**
   * Styles applied to the column input of the filter form component.
   */
  filterFormColumnInput: string;
  /**
   * Styles applied to the operator input of the filter form component.
   */
  filterFormOperatorInput: string;
  /**
   * Styles applied to the value input of the filter form component.
   */
  filterFormValueInput: string;
  /**
   * Styles applied to the root of the input component.
   */
  editInputCell: string;
  /**
   * Styles applied to the filter icon element.
   */
  filterIcon: string;
  /**
   * Styles applied to the footer container element.
   */
  footerContainer: string;
  /**
   * Styles applied to the column header icon's container.
   */
  iconButtonContainer: string;
  /**
   * Styles applied to the column header separator icon element.
   */
  iconSeparator: string;
  /**
   * Styles applied to the main container element.
   */
  main: string;
  /**
   * Styles applied to the menu element.
   */
  menu: string;
  /**
   * Styles applied to the menu icon element.
   */
  menuIcon: string;
  /**
   * Styles applied to the menu icon button element.
   */
  menuIconButton: string;
  /**
   * Styles applied to the menu icon element if the menu is open.
   */
  menuOpen: string;
  /**
   * Styles applied to the menu list element.
   */
  menuList: string;
  /**
   * Styles applied to the overlay element.
   */
  overlay: string;
  /**
   * Styles applied to the virtualization container.
   */
  virtualScroller: string;
  /**
   * Styles applied to the virtualization content.
   */
  virtualScrollerContent: string;
  /**
   * Styles applied to the virtualization content when its height is bigger than the virtualization container.
   */
  'virtualScrollerContent--overflowed': string;
  /**
   * Styles applied to the virtualization render zone.
   */
  virtualScrollerRenderZone: string;
  /**
   * Styles applied to the pinned columns.
   */
  pinnedColumns: string;
  /**
   * Styles applied to the left pinned columns.
   */
  'pinnedColumns--left': string;
  /**
   * Styles applied to the right pinned columns.
   */
  'pinnedColumns--right': string;
  /**
   * Styles applied to the pinned column headers.
   */
  pinnedColumnHeaders: string;
  /**
   * Styles applied to the left pinned column headers.
   */
  'pinnedColumnHeaders--left': string;
  /**
   * Styles applied to the right pinned column headers.
   */
  'pinnedColumnHeaders--right': string;
  /**
   * Styles applied to the root element.
   */
  root: string;
  /**
   * Styles applied to the root element if density is "standard" (default).
   */
  'root--densityStandard': string;
  /**
   * Styles applied to the root element if density is "comfortable".
   */
  'root--densityComfortable': string;
  /**
   * Styles applied to the root element if density is "compact".
   */
  'root--densityCompact': string;
  /**
   * Styles applied to the row element if the row is editable.
   */
  'row--editable': string;
  /**
   * Styles applied to the row element if the row is in edit mode.
   */
  'row--editing': string;
  /**
   * Styles applied to the floating special row reorder cell element when it is dragged.
   */
  'row--dragging': string;
  /**
   * Styles applied to the last visible row element on every page of the grid.
   */
  'row--lastVisible': string;
  /**
   * Styles applied to the row element.
   */
  row: string;
  /**
   * Styles applied to the footer row count element to show the total number of rows.
   * Only works when pagination is disabled.
   */
  rowCount: string;
  /**
   * Styles applied to the row reorder cell container element.
   */
  rowReorderCellContainer: string;
  /**
   * Styles applied to the root element of the row reorder cell
   */
  rowReorderCell: string;
  /**
   * Styles applied to the root element of the row reorder cell when dragging is allowed
   */
  'rowReorderCell--draggable': string;
  /**
   * Styles applied to both scroll area elements.
   */
  scrollArea: string;
  /**
   * Styles applied to the left scroll area element.
   */
  'scrollArea--left': string;
  /**
   * Styles applied to the right scroll area element.
   */
  'scrollArea--right': string;
  /**
   * Styles applied to the footer selected row count element.
   */
  selectedRowCount: string;
  /**
   * Styles applied to the sort icon element.
   */
  sortIcon: string;
  /**
   * Styles applied to the toolbar container element.
   */
  toolbarContainer: string;
  /**
   * Styles applied to the toolbar filter list element.
   */
  toolbarFilterList: string;
  /**
   * Styles applied to both the cell and the column header if `showColumnRightBorder={true}`.
   */
  withBorder: string;
  /**
   * Styles applied to the root of the grouping cell of the tree data.
   */
  treeDataGroupingCell: string;
  /**
   * Styles applied to the toggle of the grouping cell of the tree data.
   */
  treeDataGroupingCellToggle: string;
  /**
   * Styles applied to the root element of the grouping criteria cell
   */
  groupingCriteriaCell: string;
  /**
   * Styles applied to the toggle of the grouping criteria cell
   */
  groupingCriteriaCellToggle: string;
}

export type GridClassKey = keyof GridClasses;

export function getDataGridUtilityClass(slot: string): string {
  return generateUtilityClass('MuiDataGrid', slot);
}

export const gridClasses = generateUtilityClasses<GridClassKey>('MuiDataGrid', [
  'actionsCell',
  'autoHeight',
  'booleanCell',
  'cell--editable',
  'cell--editing',
  'cell--textCenter',
  'cell--textLeft',
  'cell--textRight',
  'cell--withRenderer',
  'cell',
  'cellContent',
  'cellCheckbox',
  'checkboxInput',
  'columnHeader--alignCenter',
  'columnHeader--alignLeft',
  'columnHeader--alignRight',
  'columnHeader--dragging',
  'columnHeader--moving',
  'columnHeader--numeric',
  'columnHeader--sortable',
  'columnHeader--sorted',
  'columnHeader--filtered',
  'columnHeader',
  'columnHeaderCheckbox',
  'columnHeaderDraggableContainer',
  'columnHeaderDropZone',
  'columnHeaderTitle',
  'columnHeaderTitleContainer',
  'columnHeaderTitleContainerContent',
  'columnHeaders',
  'columnHeadersInner',
  'columnHeadersInner--scrollable',
  'columnSeparator--resizable',
  'columnSeparator--resizing',
  'columnSeparator--sideLeft',
  'columnSeparator--sideRight',
  'columnSeparator',
  'columnsPanel',
  'columnsPanelRow',
  'detailPanel',
  'detailPanels',
  'detailPanelToggleCell',
  'detailPanelToggleCell--expanded',
  'panel',
  'panelHeader',
  'panelWrapper',
  'panelContent',
  'panelFooter',
  'paper',
  'editBooleanCell',
  'editInputCell',
  'filterForm',
  'filterFormDeleteIcon',
  'filterFormLinkOperatorInput',
  'filterFormColumnInput',
  'filterFormOperatorInput',
  'filterFormValueInput',
  'filterIcon',
  'footerContainer',
  'iconButtonContainer',
  'iconSeparator',
  'main',
  'menu',
  'menuIcon',
  'menuIconButton',
  'menuOpen',
  'menuList',
  'overlay',
  'root',
  'root--densityStandard',
  'root--densityComfortable',
  'root--densityCompact',
  'row',
  'row--editable',
  'row--editing',
  'row--lastVisible',
  'row--dragging',
  'rowReorderCellPlaceholder',
  'rowCount',
  'rowReorderCellContainer',
  'rowReorderCell',
  'rowReorderCell--draggable',
  'scrollArea--left',
  'scrollArea--right',
  'scrollArea',
  'selectedRowCount',
  'sortIcon',
  'toolbarContainer',
  'toolbarFilterList',
  'virtualScroller',
  'virtualScrollerContent',
  'virtualScrollerContent--overflowed',
  'virtualScrollerRenderZone',
  'pinnedColumns',
  'pinnedColumns--left',
  'pinnedColumns--right',
  'pinnedColumnHeaders',
  'pinnedColumnHeaders--left',
  'pinnedColumnHeaders--right',
  'withBorder',
  'treeDataGroupingCell',
  'treeDataGroupingCellToggle',
  'groupingCriteriaCell',
  'groupingCriteriaCellToggle',
]);
