export enum GridEvents {
  /**
   * Fired when the grid is resized.
   */
  resize = 'resize',
  /**
   * Fired when the grid is resized with a debounced time of 60ms.
   */
  debouncedResize = 'debouncedResize',
  /**
   * Fired when the inner size of the viewport changes. Called with an [[ElementSize]] object.
   */
  viewportInnerSizeChange = 'viewportInnerSizeChange',
  /**
   * Fired when an exception is thrown in the grid.
   */
  componentError = 'componentError',
  /**
   * Fired when the grid is unmounted.
   */
  unmount = 'unmount',
  /**
   * Fired when the mode of a cell changes.
   * @ignore - do not document
   */
  cellModeChange = 'cellModeChange',
  /**
   * Fired when a cell is clicked.
   */
  cellClick = 'cellClick',
  /**
   * Fired when a cell is double-clicked.
   */
  cellDoubleClick = 'cellDoubleClick',
  /**
   * Fired when a `mousedown` event happens in a cell..
   */
  cellMouseDown = 'cellMouseDown',
  /**
   * Fired when a `mouseup` event happens in a cell..
   */
  cellMouseUp = 'cellMouseUp',
  /**
   * Fired when a `keydown` event happens in a cell.
   */
  cellKeyDown = 'cellKeyDown',
  /**
   * Fired when a cell gains focus.
   */
  cellFocusIn = 'cellFocusIn',
  /**
   * Fired when a cell loses focus.
   */
  cellFocusOut = 'cellFocusOut',
  /**
   * Fired when the dragged cell enters a valid drop target. It's mapped to the `dragend` DOM event.
   * @ignore - do not document.
   */
  cellDragEnter = 'cellDragEnter',
  /**
   * Fired while an element or text selection is dragged over the cell.
   * It's mapped to the `dragover` DOM event.
   * @ignore - do not document.
   */
  cellDragOver = 'cellDragOver',
  /**
   * Fired when the props of the edit cell changes.
   */
  editCellPropsChange = 'editCellPropsChange',
  /**
   * Fired when the props of the edit input are committed.
   */
  cellEditCommit = 'cellEditCommit',
  /**
   * Fired when the cell turns to edit mode.
   */
  cellEditStart = 'cellEditStart',
  /**
   * Fired when the cell turns back to view mode.
   */
  cellEditStop = 'cellEditStop',
  /**
   * Fired when the row turns to edit mode.
   */
  rowEditStart = 'rowEditStart',
  /**
   * Fired when the row turns back to view mode.
   */
  rowEditStop = 'rowEditStop',
  /**
   * Fired when the props of the edit input are committed.
   */
  rowEditCommit = 'rowEditCommit',
  /**
   * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a cell.
   * @ignore - do not document.
   */
  cellNavigationKeyDown = 'cellNavigationKeyDown',
  /**
   * Fired when a row is clicked.
   */
  rowClick = 'rowClick',
  /**
   * Fired when a row is double-clicked.
   */
  rowDoubleClick = 'rowDoubleClick',
  /**
   * Fired when the row editing model changes.
   */
  editRowsModelChange = 'editRowsModelChange',
  /**
   * Fired when a column header loses focus.
   * @ignore - do not document.
   */
  columnHeaderBlur = 'columnHeaderBlur',
  /**
   * Fired when a column header gains focus.
   * @ignore - do not document.
   */
  columnHeaderFocus = 'columnHeaderFocus',
  /**
   * Fired when a [navigation key](/components/data-grid/accessibility#keyboard-navigation) is pressed in a column header.
   * @ignore - do not document.
   */
  columnHeaderNavigationKeyDown = 'columnHeaderNavigationKeyDown',
  /**
   * Fired when a key is pressed in a column header. It's mapped do the `keydown` DOM event.
   */
  columnHeaderKeyDown = 'columnHeaderKeyDown',
  /**
   * Fired when a column header is clicked
   */
  columnHeaderClick = 'columnHeaderClick',
  /**
   * Fired when a column header is double-clicked.
   */
  columnHeaderDoubleClick = 'columnHeaderDoubleClick',
  /**
   * Fired when a `mouseover` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderOver = 'columnHeaderOver',
  /**
   * Fired when a `mouseout` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderOut = 'columnHeaderOut',
  /**
   * Fired when a `mouseenter` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderEnter = 'columnHeaderEnter',
  /**
   * Fired when a `mouseleave` event happens in a column header.
   * @ignore - do not document.*
   */
  columnHeaderLeave = 'columnHeaderLeave',
  /**
   * Fired when the user starts dragging a column header. It's mapped to the `dragstart` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragStart = 'columnHeaderDragStart',
  /**
   * Fired while an element or text selection is dragged over the column header.
   * It's mapped to the `dragover` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragOver = 'columnHeaderDragOver',
  /**
   * Fired when the dragged column header enters a valid drop target.
   * It's mapped to the `dragend` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragEnter = 'columnHeaderDragEnter',
  /**
   * Fired when the dragging of a column header ends.
   * @ignore - do not document.
   */
  columnHeaderDragEnd = 'columnHeaderDragEnd',
  /**
   * Fired when the selection state of one or multiple rows changes.
   */
  selectionChange = 'selectionChange',
  /**
   * Fired when the value of the selection checkbox of the header is changed
   */
  headerSelectionCheckboxChange = 'headerSelectionCheckboxChange',
  /**
   * Fired when the value of the selection checkbox of a row is changed
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
   * Fired during the scroll of the grid viewport.
   */
  rowsScroll = 'rowsScroll',
  /**
   * Fired when scrolling to the bottom of the grid viewport.
   */
  rowsScrollEnd = 'rowsScrollEnd',
  /**
   * Fired when a `mousedown` DOM event happens in the column header separator.
   * @ignore - do not document.
   */
  columnSeparatorMouseDown = 'columnSeparatorMouseDown',
  /**
   * Fired during the resizing of a column.
   */
  columnResize = 'columnResize',
  /**
   * Fired when the width of a column is changed.
   */
  columnWidthChange = 'columnWidthChange',
  /**
   * Fired when the user starts resizing a column.
   */
  columnResizeStart = 'columnResizeStart',
  /**
   * Fired when the user stops resizing a column.
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
   * Fired when the expansion of a row is changed. Called with a [[GridRowTreeNodeConfig]] object.
   * @ignore - do not document.
   */
  rowExpansionChange = 'rowExpansionChange',
  /**
   * Fired when the visible rows are updated
   * @ignore - do not document.
   */
  visibleRowsSet = 'visibleRowsSet',
  /**
   * Fired when the columns state is changed.
   */
  columnsChange = 'columnsChange',
  /**
   * Fired when a pre-processor is registered.
   * @ignore - do not document.
   */
  preProcessorRegister = 'preProcessorRegister',
  /**
   * Fired when a pre-processor is unregistered.
   * @ignore - do not document.
   */
  preProcessorUnregister = 'preProcessorUnregister',
  /**
   * Fired when the row grouping function is changed
   * @ignore - do not document.
   */
  rowGroupsPreProcessingChange = 'rowGroupsPreProcessingChange',
  /**
   * Fired when the sort model changes.
   */
  sortModelChange = 'sortModelChange',
  /**
   * Fired when the filter model changes.
   */
  filterModelChange = 'filterModelChange',
  /**
   * Fired when the state of the grid is updated.
   */
  stateChange = 'stateChange',
  /**
   * Fired when a column visibility changes.
   */
  columnVisibilityChange = 'columnVisibilityChange',
}

export type GridEventsStr = keyof typeof GridEvents;
