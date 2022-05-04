import * as React from 'react';
import type {
  GridCellEditCommitParams,
  GridColumnHeaderParams,
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridColumnVisibilityChangeParams,
  GridEditCellPropsParams,
  GridHeaderSelectionCheckboxParams,
  GridPreferencePanelParams,
  GridRowParams,
  GridRowSelectionCheckboxParams,
  GridScrollParams,
} from '../params';
import { GridCellEditStartParams, GridCellEditStopParams } from '../params/gridEditCellParams';
import { GridCellParams } from '../params/gridCellParams';
import type { GridFilterModel } from '../gridFilterModel';
import type { GridSortModel } from '../gridSortModel';
import type { GridEditRowsModel } from '../gridEditRowModel';
import type { GridSelectionModel } from '../gridSelectionModel';
import type { ElementSize } from '../elementSize';
import type { MuiBaseEvent } from '../muiEvent';
import type { GridRowId, GridRowTreeNodeConfig } from '../gridRows';
import type { GridColumnVisibilityModel } from '../../hooks/features/columns';
import type { GridStrategyProcessorName } from '../../hooks/core/strategyProcessing';
import { GridRowEditStartParams, GridRowEditStopParams } from '../params/gridRowParams';
import { GridCellModesModel, GridRowModesModel } from '../api/gridEditingApi';

export interface GridRowEventLookup {
  /**
   * Fired when a row is clicked.
   * Not fired if the cell clicked is from an interactive column (actions, checkbox, etc).
   */
  rowClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  /**
   * Fired when a row is double-clicked.
   */
  rowDoubleClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  /**
   * Fired when the mouse enters the row. Called with a [[GridRowParams]] object.
   */
  rowMouseEnter: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  /**
   * Fired when the mouse leaves the row. Called with a [[GridRowParams]] object.
   */
  rowMouseLeave: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  /**
   * Fired when the user starts dragging a row. It's mapped to the `dragstart` DOM event.
   * @ignore - do not document.
   */
  rowDragStart: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired while an element or text selection is dragged over the row.
   * It's mapped to the `dragover` DOM event.
   * @ignore - do not document.
   */
  rowDragOver: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired when the dragging of a row ends.
   * @ignore - do not document.
   */
  rowDragEnd: {
    params: GridRowParams;
    event: React.DragEvent<HTMLElement>;
  };
}

export interface GridColumnHeaderEventLookup {
  /**
   * Fired when a column header is clicked
   */
  columnHeaderClick: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a column header is double-clicked.
   */
  columnHeaderDoubleClick: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mouseover` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderOver: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mouseout` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderOut: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mouseenter` event happens in a column header.
   * @ignore - do not document.
   */
  columnHeaderEnter: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mouseleave` event happens in a column header.
   * @ignore - do not document.*
   */
  columnHeaderLeave: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a key is pressed in a column header. It's mapped do the `keydown` DOM event.
   */
  columnHeaderKeyDown: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  /**
   * Fired when a column header gains focus.
   * @ignore - do not document.
   */
  columnHeaderFocus: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent<HTMLElement>;
  };
  /**
   * Fired when a column header loses focus.
   * @ignore - do not document.
   */
  columnHeaderBlur: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent<HTMLElement>;
  };
  /**
   * Fired when the user starts dragging a column header. It's mapped to the `dragstart` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragStart: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired when the dragged column header enters a valid drop target.
   * It's mapped to the `dragend` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragEnter: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired while an element or text selection is dragged over the column header.
   * It's mapped to the `dragover` DOM event.
   * @ignore - do not document.
   */
  columnHeaderDragOver: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired when the dragging of a column header ends.
   * @ignore - do not document.
   */
  columnHeaderDragEnd: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired when a `mousedown` DOM event happens in the column header separator.
   * @ignore - do not document.
   */
  columnSeparatorMouseDown: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
}

export interface GridCellEventLookup {
  /**
   * Fired when a cell is clicked.
   */
  cellClick: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a cell is double-clicked.
   */
  cellDoubleClick: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mousedown` event happens in a cell.
   */
  cellMouseDown: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `mouseup` event happens in a cell.
   */
  cellMouseUp: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when a `keydown` event happens in a cell.
   */
  cellKeyDown: {
    params: GridCellParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  /**
   * Fired when the dragged cell enters a valid drop target. It's mapped to the `dragend` DOM event.
   * @ignore - do not document.
   */
  cellDragEnter: {
    params: GridCellParams;
    event: React.DragEvent<HTMLElement>;
  };
  /**
   * Fired while an element or text selection is dragged over the cell.
   * It's mapped to the `dragover` DOM event.
   * @ignore - do not document.
   */
  cellDragOver: {
    params: GridCellParams;
    event: React.DragEvent<HTMLElement>;
  };
}

export interface GridControlledStateEventLookup {
  /**
   * Fired when the page size changes.
   */
  pageSizeChange: { params: number };
  /**
   * Fired when the page changes.
   */
  pageChange: { params: number };
  /**
   * Fired when the filter model changes.
   */
  filterModelChange: { params: GridFilterModel };
  /**
   * Fired when the sort model changes.
   */
  sortModelChange: { params: GridSortModel };
  /**
   * Fired when the row editing model changes.
   */
  editRowsModelChange: { params: GridEditRowsModel };
  /**
   * Fired when the selection state of one or multiple rows changes.
   */
  selectionChange: { params: GridSelectionModel };
  /**
   * Fired when the column visibility model changes.
   */
  columnVisibilityModelChange: { params: GridColumnVisibilityModel };
}

export interface GridEventLookup
  extends GridRowEventLookup,
    GridColumnHeaderEventLookup,
    GridCellEventLookup,
    GridControlledStateEventLookup {
  /**
   * Fired when the grid is unmounted.
   */
  unmount: {};
  /**
   * Fired when an exception is thrown in the grid.
   */
  componentError: { params: any };
  /**
   * Fired when the state of the grid is updated.
   */
  stateChange: { params: any };
  /**
   * Fired when the grid is resized.
   */
  resize: { params: ElementSize };
  /**
   * Fired when the inner size of the viewport changes. Called with an [[ElementSize]] object.
   */
  viewportInnerSizeChange: { params: ElementSize };
  /**
   * Fired when the grid is resized with a debounced time of 60ms.
   */
  debouncedResize: { params: ElementSize };
  /**
   * Fired when a processor of the active strategy changes.
   * @ignore - do not document.
   */
  activeStrategyProcessorChange: {
    params: GridStrategyProcessorName;
  };
  /**
   * Fired when the callback to decide if a strategy is available or not changes.
   * @ignore - do not document.
   */
  strategyAvailabilityChange: {};

  // Columns
  /**
   * Fired when the columns state is changed.
   */
  columnsChange: { params: string[] };
  /**
   * Fired when the width of a column is changed.
   */
  columnWidthChange: { params: GridColumnResizeParams; event: MouseEvent | {} };
  /**
   * Fired when the user starts resizing a column.
   */
  columnResizeStart: {
    params: { field: string };
    event: React.MouseEvent<HTMLElement>;
  };
  /**
   * Fired when the user stops resizing a column.
   */
  columnResizeStop: { params: null; event: MouseEvent };
  /**
   * Fired when a column visibility changes.
   * It is not fired when the `columnVisibilityModel` is controlled or initialized.
   * It is not fired when toggling all column's visibility at once.
   * @deprecated Use `'columnVisibilityModelChange'` instead.
   */
  columnVisibilityChange: { params: GridColumnVisibilityChangeParams };
  /**
   * Fired during the resizing of a column.
   */
  columnResize: { params: GridColumnResizeParams; event: MouseEvent };
  /**
   * Fired when the user ends reordering a column.
   */
  columnOrderChange: { params: GridColumnOrderChangeParams };

  // Rows
  /**
   * Fired when the rows are updated.
   * @ignore - do not document.
   */
  rowsSet: {};
  /**
   * Fired when the filtered rows are updated
   * @ignore - do not document.
   */
  filteredRowsSet: {};
  /**
   * Fired when the sorted rows are updated
   * @ignore - do not document
   */
  sortedRowsSet: {};
  /**
   * Fired when the expansion of a row is changed. Called with a [[GridRowTreeNodeConfig]] object.
   * @ignore - do not document.
   */
  rowExpansionChange: { params: GridRowTreeNodeConfig };

  // Edit
  /**
   * Fired when the mode of a cell changes.
   * @ignore - do not document
   */
  cellModeChange: { params: GridCellParams };
  /**
   * Fired when the model that controls the cell modes changes.
   */
  cellModesModelChange: { params: GridCellModesModel };
  /**
   * Fired when the model that controls the row modes changes.
   */
  rowModesModelChange: { params: GridRowModesModel };
  /**
   * Fired when the cell turns to edit mode.
   */
  cellEditStart: {
    params: GridCellEditStartParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  /**
   * Fired when the cell turns back to view mode.
   */
  cellEditStop: {
    params: GridCellEditStopParams;
    event: MuiBaseEvent;
  };
  /**
   * Fired when the props of the edit input are committed.
   */
  cellEditCommit: { params: GridCellEditCommitParams; event: MuiBaseEvent };
  /**
   * Fired when the props of the edit cell changes.
   */
  editCellPropsChange: {
    params: GridEditCellPropsParams;
    event: React.SyntheticEvent<HTMLElement> | {};
  };
  /**
   * Fired when the row turns to edit mode.
   */
  rowEditStart: {
    params: GridRowEditStartParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  /**
   * Fired when the row turns back to view mode.
   */
  rowEditStop: {
    params: GridRowEditStopParams;
    event: MuiBaseEvent;
  };
  /**
   * Fired when the props of the edit input are committed.
   */
  rowEditCommit: { params: GridRowId; event: MuiBaseEvent };

  // Focus
  /**
   * Fired when a cell gains focus.
   */
  cellFocusIn: { params: GridCellParams };
  /**
   * Fired when a cell loses focus.
   */
  cellFocusOut: { params: GridCellParams; event: MuiBaseEvent };

  // Navigation
  /**
   * Fired when a [navigation key](/x/react-data-grid/accessibility#keyboard-navigation) is pressed in a cell.
   * @ignore - do not document.
   */
  cellNavigationKeyDown: {
    params: GridCellParams | GridRowParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  /**
   * Fired when a [navigation key](/x/react-data-grid/accessibility#keyboard-navigation) is pressed in a column header.
   * @ignore - do not document.
   */
  columnHeaderNavigationKeyDown: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent<HTMLElement>;
  };

  // Scroll
  /**
   * Fired during the scroll of the grid viewport.
   */
  rowsScroll: { params: GridScrollParams; event: React.UIEvent | MuiBaseEvent };
  /**
   * Fired when the content size used by the `GridVirtualScroller` changes.
   * @ignore - do not document.
   */
  virtualScrollerContentSizeChange: {};
  /**
   * Fired when the content is scrolled by the mouse wheel.
   * It's attached to the "mousewheel" event.
   * @ignore - do not document.
   */
  virtualScrollerWheel: { params: {}; event: React.WheelEvent };
  /**
   * Fired when the content is moved using a touch device.
   * It's attached to the "touchmove" event.
   * @ignore - do not document.
   */
  virtualScrollerTouchMove: { params: {}; event: React.TouchEvent };

  // Selection
  /**
   * Fired when the value of the selection checkbox of the header is changed
   */
  headerSelectionCheckboxChange: { params: GridHeaderSelectionCheckboxParams };
  /**
   * Fired when the value of the selection checkbox of a row is changed
   */
  rowSelectionCheckboxChange: {
    params: GridRowSelectionCheckboxParams;
    event: React.ChangeEvent<HTMLElement>;
  };

  // PreferencePanel
  /**
   * Fired when the preference panel is closed.
   */
  preferencePanelClose: { params: GridPreferencePanelParams };
  /**
   * Fired when the preference panel is opened.
   */
  preferencePanelOpen: { params: GridPreferencePanelParams };
}
