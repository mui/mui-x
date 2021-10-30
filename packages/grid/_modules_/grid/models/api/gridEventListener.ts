import * as React from 'react';
import { MuiBaseEvent, MuiEvent } from '../muiEvent';
import { GridCallbackDetails } from './gridCallbackDetails';
import { GridEvents } from '../../constants';
import { GridFilterModel } from '../gridFilterModel';
import { GridSortModel } from '../gridSortModel';
import type {
  GridCellEditCommitParams,
  GridCellParams,
  GridColumnHeaderParams,
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridColumnVisibilityChangeParams,
  GridHeaderSelectionCheckboxParams,
  GridRowParams,
  GridRowScrollEndParams,
  GridRowSelectionCheckboxParams,
  GridScrollParams,
  GridEditCellPropsParams,
} from '../params';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridSelectionModel } from '../gridSelectionModel';
import { GridState } from '../gridState';
import { ElementSize } from '../elementSize';
import { GridRowId } from '../gridRows';

export interface GridRowEventLookup {
  rowClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
  rowDoubleClick: { params: GridRowParams; event: React.MouseEvent<HTMLElement> };
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
}

export interface GridEventLookup
  extends GridRowEventLookup,
    GridColumnHeaderEventLookup,
    GridCellEventLookup,
    GridControlledStateEventLookup {
  unmount: {};
  componentError: { params: any };
  stateChange: { params: GridState };
  resize: { params: ElementSize };
  debouncedResize: { params: ElementSize };
  rowGroupsPreProcessingChange: {};
  columnsPreProcessingChange: {};

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
  visibleRowsSet: {};

  // Edit
  cellModeChange: { params: GridCellParams };
  cellEditStart: {
    params: GridCellParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  cellEditStop: { params: GridCellParams; event: MuiBaseEvent };
  cellEditCommit: { params: GridCellEditCommitParams; event: MuiBaseEvent };
  editCellPropsChange: {
    params: GridEditCellPropsParams;
    event: React.SyntheticEvent<HTMLElement> | {};
  };
  rowEditStart: {
    params: GridRowParams;
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  };
  rowEditStop: { params: GridRowParams; event: MuiBaseEvent };
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
  rowsScroll: { params: GridScrollParams };
  rowsScrollEnd: { params: GridRowScrollEndParams };

  // Selection
  headerSelectionCheckboxChange: { params: GridHeaderSelectionCheckboxParams };
  rowSelectionCheckboxChange: {
    params: GridRowSelectionCheckboxParams;
    event: React.ChangeEvent<HTMLElement>;
  };
}

type PublisherArgsNoEvent<E extends keyof typeof GridEvents, T extends { params: any }> = [
  E,
  T['params'],
];
type PublisherArgsRequiredEvent<
  E extends keyof typeof GridEvents,
  T extends { params: any; event: MuiBaseEvent },
> = [E, T['params'], T['event']];
type PublisherArgsOptionalEvent<
  E extends keyof typeof GridEvents,
  T extends { params: any; event: MuiBaseEvent },
> = PublisherArgsRequiredEvent<E, T> | PublisherArgsNoEvent<E, T>;

type PublisherArgsEvent<
  E extends keyof typeof GridEvents,
  T extends { params: any; event: MuiBaseEvent },
> = {} extends T['event'] ? PublisherArgsOptionalEvent<E, T> : PublisherArgsRequiredEvent<E, T>;

type PublisherArgsParams<E extends keyof typeof GridEvents, T extends { params: any }> = [
  E,
  T['params'],
];

type PublisherArgsNoParams<E extends keyof typeof GridEvents> = [E];

type GridEventPublisherArg<E extends keyof typeof GridEvents> = GridEventLookup[E] extends {
  params: any;
  event: MuiBaseEvent;
}
  ? PublisherArgsEvent<E, GridEventLookup[E]>
  : GridEventLookup[E] extends { params: any }
  ? PublisherArgsParams<E, GridEventLookup[E]>
  : PublisherArgsNoParams<E>;

export type GridEventPublisher = <E extends keyof typeof GridEvents>(
  ...params: GridEventPublisherArg<E>
) => void;

export type GridEventListener<E extends keyof typeof GridEvents> = (
  params: GridEventLookup[E] extends { params: any } ? GridEventLookup[E]['params'] : undefined,
  event: GridEventLookup[E] extends { event: MuiBaseEvent }
    ? MuiEvent<GridEventLookup[E]['event']>
    : MuiEvent<{}>,
  details: GridCallbackDetails,
) => void;
