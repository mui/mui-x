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

export interface GridRowEventLookup {
  rowClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  rowDoubleClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  rowMouseEnter: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  rowMouseLeave: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
}

export interface GridColumnHeaderEventLookup {
  columnHeaderClick: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderDoubleClick: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderOver: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderOut: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderEnter: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderLeave: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
  columnHeaderKeyDown: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  columnHeaderFocus: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent<HTMLElement>;
  };
  columnHeaderBlur: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent<HTMLElement>;
  };
  columnHeaderDragStart: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  columnHeaderDragEnter: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  columnHeaderDragOver: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  columnHeaderDragEnd: {
    params: GridColumnHeaderParams;
    event: React.DragEvent<HTMLElement>;
  };
  columnSeparatorMouseDown: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent<HTMLElement>;
  };
}

export interface GridCellEventLookup {
  cellClick: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  cellDoubleClick: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  cellMouseDown: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  cellMouseUp: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement>;
  };
  cellKeyDown: {
    params: GridCellParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  cellDragEnter: {
    params: GridCellParams;
    event: React.DragEvent<HTMLElement>;
  };
  cellDragOver: {
    params: GridCellParams;
    event: React.DragEvent<HTMLElement>;
  };
}

export interface GridControlledStateEventLookup {
  pageSizeChange: { params: number };
  pageChange: { params: number };
  filterModelChange: { params: GridFilterModel };
  sortModelChange: { params: GridSortModel };
  editRowsModelChange: { params: GridEditRowsModel };
  selectionChange: { params: GridSelectionModel };
  columnVisibilityModelChange: { params: GridColumnVisibilityModel };
  detailPanelsExpandedRowIdsChange: { params: GridRowId[] };
}

export interface GridEventLookup
  extends GridRowEventLookup,
    GridColumnHeaderEventLookup,
    GridCellEventLookup,
    GridControlledStateEventLookup {
  unmount: {};
  componentError: { params: any };
  stateChange: { params: any };
  resize: { params: ElementSize };
  viewportInnerSizeChange: { params: ElementSize };
  debouncedResize: { params: ElementSize };
  activeStrategyProcessorChange: {
    params: GridStrategyProcessorName;
  };
  strategyAvailabilityChange: {};

  // Columns
  columnsChange: { params: string[] };
  columnWidthChange: { params: GridColumnResizeParams; event: MouseEvent | {} };
  columnResizeStart: {
    params: { field: string };
    event: React.MouseEvent<HTMLElement>;
  };
  columnResizeStop: { params: null; event: MouseEvent };
  columnVisibilityChange: { params: GridColumnVisibilityChangeParams };
  columnResize: { params: GridColumnResizeParams; event: MouseEvent };
  columnOrderChange: { params: GridColumnOrderChangeParams };

  // Rows
  rowsSet: {};
  filteredRowsSet: {};
  sortedRowsSet: {};
  rowExpansionChange: { params: GridRowTreeNodeConfig };

  // Edit
  cellModeChange: { params: GridCellParams };
  cellEditStart: {
    params: GridCellEditStartParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  cellEditStop: {
    params: GridCellEditStopParams;
    event: MuiBaseEvent;
  };
  cellEditCommit: { params: GridCellEditCommitParams; event: MuiBaseEvent };
  editCellPropsChange: {
    params: GridEditCellPropsParams;
    event: React.SyntheticEvent<HTMLElement> | {};
  };
  rowEditStart: {
    params: GridRowEditStartParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  rowEditStop: {
    params: GridRowEditStopParams;
    event: MuiBaseEvent;
  };
  rowEditCommit: { params: GridRowId; event: MuiBaseEvent };

  // Focus
  cellFocusIn: { params: GridCellParams };
  cellFocusOut: { params: GridCellParams; event: MuiBaseEvent };

  // Navigation
  cellNavigationKeyDown: {
    params: GridCellParams | GridRowParams;
    event: React.KeyboardEvent<HTMLElement>;
  };
  columnHeaderNavigationKeyDown: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent<HTMLElement>;
  };

  // Scroll
  rowsScroll: { params: GridScrollParams; event: React.UIEvent | MuiBaseEvent };
  virtualScrollerContentSizeChange: {};
  virtualScrollerWheel: { params: {}; event: React.WheelEvent };
  virtualScrollerTouchMove: { params: {}; event: React.TouchEvent };

  // Selection
  headerSelectionCheckboxChange: { params: GridHeaderSelectionCheckboxParams };
  rowSelectionCheckboxChange: {
    params: GridRowSelectionCheckboxParams;
    event: React.ChangeEvent<HTMLElement>;
  };

  // PreferencePanel
  preferencePanelClose: { params: GridPreferencePanelParams };
  preferencePanelOpen: { params: GridPreferencePanelParams };
}
