export enum GridEvents {
  /**
   * Fired when the grid is resized. Called with a [[ElementSize]] object.
   */
  resize = 'resize',
  /**
   * Fired when the grid is resized with a debounced time of 60ms. Called with a [[ElementSize]] object.
   */
  debouncedResize = 'debouncedResize',
  /**
   * Fired when an exception is thrown in the grid.
   */
  componentError = 'componentError',
  /**
   * Fired when the grid is unmounted.
   */
  unmount = 'unmount',
  /**
   * Fired when the mode of a cell changes. Called with a [[GridCellModeChangeParams]] object.
   * @ignore - do not document
   */
  cellModeChange = 'cellModeChange',
  /**
   * Fired when a cell is clicked. Called with a [[GridCellParams]] object.
   */
  cellClick = 'cellClick',
  /**
   * Fired when a cell is double-clicked. Called with a [[GridCellParams]] object.
   */
  cellDoubleClick = 'cellDoubleClick',
  /**
   * Fired when a `mousedown` event happens in a cell. Called with a [[GridCellParams]] object.
   */
  cellMouseDown = 'cellMouseDown',
  /**
   * Fired when a `mouseup` event happens in a cell. Called with a [[GridCellParams]] object.
   */
  cellMouseUp = 'cellMouseUp',
  /**
   * Fired when a `keydown` event happens in a cell. Called with a [[GridCellParams]] object.
   */
  cellKeyDown = 'cellKeyDown',
  /**
   * Fired when a cell gains focus. Called with a [[GridCellParams]] object.
   */
  cellFocusIn = 'cellFocusIn',
  /**
   * Fired when a cell loses focus. Called with a [[GridCellParams]] object.
   */
  cellFocusOut = 'cellFocusOut',
  /**
   * Fired when the user starts dragging a cell. It's mapped to the `dragstart` DOM event.
   * Called with a [[GridCellParams]] object.
   * @ignore - do not document.
   */
  cellDragStart = 'cellDragStart',
  /**
   * Fired when the dragged cell enters a valid drop target. It's mapped to the `dragend` DOM event.
   * Called with a [[GridCellParams]] object.
   * @ignore - do not document.
   */
  cellDragEnter = 'cellDragEnter',
  /**
   * Fired while an element or text selection is dragged over the cell.
   * It's mapped to the `dragover` DOM event.
   * Called with a [[GridCellParams]] object.
   * @ignore - do not document.
   */
  cellDragOver = 'cellDragOver',
  /**
   * Fired when the dragging of a cell ends. Called with a [[GridCellParams]] object.
   * @ignore - do not document.
   */
  cellDragEnd = 'cellDragEnd',
  /**
   * Fired when the props of the edit cell changes. Called with a [[GridEditCellPropsParams]] object.
   */
  editCellPropsChange = 'editCellPropsChange',
  /**
   * Fired when the props of the edit input are committed. Called with a [[GridEditCellPropsParams]] object.
   */
  cellEditCommit = 'cellEditCommit',
  /**
   * Fired when the cell turns to edit mode. Called with a [[GridCellParams]] object.
   */
  cellEditStart = 'cellEditStart',
  /**
   * Fired when the cell turns back to view mode. Called with a [[GridCellParams]] object.
   */
  cellEditStop = 'cellEditStop',
  /**
   * Fired when the row turns to edit mode. Called with a [[GridCellParams]] object.
   */
  rowEditStart = 'rowEditStart',
  /**
   * Fired when the row turns back to view mode. Called with a [[GridCellParams]] object.
   */
  rowEditStop = 'rowEditStop',
  /**
   * Fired when the props of the edit input are committed. Called with the [[GridRowId]] of the row.
   */
  rowEditCommit = 'rowEditCommit',
  /**
   * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a cell.
   * Called with a [[GridCellParams]] object.
   * @ignore - do not document.
   */
  cellNavigationKeyDown = 'cellNavigationKeyDown',
  /**
   * Fired when a row is clicked. Called with a [[GridRowParams]] object.
   */
  rowClick = 'rowClick',
  /**
   * Fired when a row is double-clicked. Called with a [[GridRowParams]] object.
   */
  rowDoubleClick = 'rowDoubleClick',
  /**
   * Fired when the row editing model changes. Called with a [[GridEditRowModelParams]] object.
   */
  editRowsModelChange = 'editRowsModelChange',
  /**
   * Fired when a column header loses focus. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderBlur = 'columnHeaderBlur',
  /**
   * Fired when a column header gains focus. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderFocus = 'columnHeaderFocus',
  /**
   * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a column header.
   * Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderNavigationKeyDown = 'columnHeaderNavigationKeyDown',
  /**
   * Fired when a key is pressed in a column header. It's mapped do the `keydown` DOM event.
   * Called with a [[GridColumnHeaderParams]] object.
   */
  columnHeaderKeyDown = 'columnHeaderKeyDown',
  /**
   * Fired when a column header is clicked. Called with a [[GridColumnHeaderParams]] object.
   */
  columnHeaderClick = 'columnHeaderClick',
  /**
   * Fired when a column header is double-clicked. Called with a [[GridColumnHeaderParams]] object.
   */
  columnHeaderDoubleClick = 'columnHeaderDoubleClick',
  /**
   * Fired when a `mouseover` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderOver = 'columnHeaderOver',
  /**
   * Fired when a `mouseout` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderOut = 'columnHeaderOut',
  /**
   * Fired when a `mouseenter` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderEnter = 'columnHeaderEnter',
  /**
   * Fired when a `mouseleave` event happens in a column header. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.*
   */
  columnHeaderLeave = 'columnHeaderLeave',
  /**
   * Fired when the user starts dragging a column header. It's mapped to the `dragstart` DOM event.
   * Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderDragStart = 'columnHeaderDragStart',
  /**
   * Fired while an element or text selection is dragged over the column header.
   * It's mapped to the `dragover` DOM event.
   * Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderDragOver = 'columnHeaderDragOver',
  /**
   * Fired when the dragged column header enters a valid drop target.
   * It's mapped to the `dragend` DOM event.
   * Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderDragEnter = 'columnHeaderDragEnter',
  /**
   * Fired when the dragging of a column header ends. Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnHeaderDragEnd = 'columnHeaderDragEnd',
  /**
   * Fired when the selection state of one or multiple rows changes.
   * Called with a [[GridSelectionModelChangeParams]] object.
   */
  selectionChange = 'selectionChange',
  /**
   * Fired when the value of the selection checkbox of the header is changed
   * Called with a [[GridHeaderSelectionCheckboxParams]] object.
   */
  headerSelectionCheckboxChange = 'headerSelectionCheckboxChange',
  /**
   * Fired when the value of the selection checkbox of a row is changed
   * Called with a [[GridRowSelectionCheckboxParams]] object.
   */
  rowSelectionCheckboxChange = 'rowSelectionCheckboxChange',
  /**
   * Fired when the page changes.
   */
  pageChange = 'pageChange',
  /**
   * Fired when the page size changes.
   */
  pageSizeChange = 'pageSizeChange',
  /**
   * Fired during the scroll of the grid viewport. Called with a [[GridScrollParams]] object.
   */
  rowsScroll = 'rowsScroll',
  /**
   * Fired when scrolling to the bottom of the grid viewport. Called with a [[GridRowScrollEndParams]] object.
   */
  rowsScrollEnd = 'rowsScrollEnd',
  /**
   * Fired when a `mousedown` DOM event happens in the column header separator.
   * Called with a [[GridColumnHeaderParams]] object.
   * @ignore - do not document.
   */
  columnSeparatorMouseDown = 'columnSeparatorMouseDown',
  /**
   * Fired during the resizing of a column. Called with a [[GridColumnResizeParams]] object.
   */
  columnResize = 'columnResize',
  /**
   * Fired when the width of a column is changed. Called with a [[GridColumnResizeParams]] object.
   */
  columnWidthChange = 'columnWidthChange',
  /**
   * Fired when the user starts resizing a column. Called with an object `{ field: string }`.
   */
  columnResizeStart = 'columnResizeStart',
  /**
   * Fired when the user stops resizing a column. Called with an object `{ field: string }`.
   */
  columnResizeStop = 'columnResizeStop',
  /**
   * Fired when the user ends reordering a column.
   */
  columnOrderChange = 'columnOrderChange',
  /**
   * Fired when the rows are updated.
   * @ignore - do not document.
   */
  rowsSet = 'rowsSet',
  /**
   * Fired when the visible rows are updated
   * @ignore - do not document.
   */
  visibleRowsSet = 'visibleRowsSet',
  /**
   * Fired when the columns state is changed.
   * Called with an array of strings corresponding to the field names.
   */
  columnsChange = 'columnsChange',
  /**
   * Fired when a column pre-processing is changed
   * @ignore - do not document
   */
  columnsPreProcessingChange = 'columnsPreProcessingChange',
  /**
   * Fired when the row grouping function is changed
   * @ignore - do not document
   */
  rowGroupsPreProcessingChange = 'rowGroupsPreProcessingChange',
  /**
   * Fired when the sort model changes.
   * Called with a [[GridSortModelParams]] object.
   */
  sortModelChange = 'sortModelChange',
  /**
   * Fired when the filter model changes.
   * Called with a [[GridFilterModel]] object.
   */
  filterModelChange = 'filterModelChange',
  /**
   * Fired when the state of the grid is updated. Called with a [[GridState]] object.
   */
  stateChange = 'stateChange',
  /**
   * Fired when a column visibility changes. Called with a [[GridColumnVisibilityChangeParams]] object.
   */
  columnVisibilityChange = 'columnVisibilityChange',
}
