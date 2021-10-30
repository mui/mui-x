import * as React from 'react';
import { MuiBaseEvent, MuiEvent } from '../muiEvent';
import { GridCallbackDetails } from './gridCallbackDetails';
import { GridEvents } from '../../constants';
import { GridFilterModel } from '../gridFilterModel';
import { GridSortModel } from '../gridSortModel';
import type {
  GridCellEditCommitParams,
  GridCellParams,
  GridColumnHeaderParams, GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridColumnVisibilityChangeParams, GridHeaderSelectionCheckboxParams,
  GridRowParams, GridRowScrollEndParams, GridRowSelectionCheckboxParams, GridScrollParams, GridEditCellPropsParams
} from '../params';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridSelectionModel } from '../gridSelectionModel';
import { GridState } from '../gridState';
import { ElementSize } from '../elementSize';
import { GridRowId } from '../gridRows';

export interface GridRowEventLookup {
  [GridEvents.rowClick]: { params: GridRowParams; event: React.MouseEvent };
  [GridEvents.rowDoubleClick]: { params: GridRowParams; event: React.MouseEvent };
}

export interface GridColumnHeaderEventLookup {
  [GridEvents.columnHeaderClick]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderDoubleClick]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderOver]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderOut]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderEnter]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderLeave]: {
    params: GridColumnHeaderParams;
    event: React.MouseEvent;
  };
  [GridEvents.columnHeaderKeyDown]: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent;
  };
  [GridEvents.columnHeaderFocus]: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent;
  };
  [GridEvents.columnHeaderBlur]: {
    params: GridColumnHeaderParams;
    event: React.FocusEvent;
  };
  [GridEvents.columnHeaderDragStart]: {
    params: GridColumnHeaderParams;
    event: React.DragEvent;
  };
  [GridEvents.columnHeaderDragEnter]: {
    params: GridColumnHeaderParams;
    event: React.DragEvent;
  };
  [GridEvents.columnHeaderDragOver]: {
    params: GridColumnHeaderParams;
    event: React.DragEvent;
  };
  [GridEvents.columnHeaderDragEnd]: {
    params: GridColumnHeaderParams;
    event: React.DragEvent;
  };
  [GridEvents.columnSeparatorMouseDown]: { params: GridColumnHeaderParams, event: React.MouseEvent };
}

export interface GridCellEventLookup {
  [GridEvents.cellClick]: {
    params: GridCellParams;
    event: React.MouseEvent;
  };
  [GridEvents.cellDoubleClick]: {
    params: GridCellParams;
    event: React.MouseEvent;
  };
  [GridEvents.cellMouseDown]: {
    params: GridCellParams;
    event: React.MouseEvent;
  };
  [GridEvents.cellMouseUp]: {
    params: GridCellParams;
    event: React.MouseEvent;
  };
  [GridEvents.cellKeyDown]: {
    params: GridCellParams;
    event: React.KeyboardEvent;
  };
  [GridEvents.cellDragEnter]: {
    params: GridCellParams;
    event: React.DragEvent;
  };
  [GridEvents.cellDragOver]: {
    params: GridCellParams;
    event: React.DragEvent;
  };
}

export interface GridControlledStateEventLookup {
  [GridEvents.pageSizeChange]: { params: number };
  [GridEvents.pageChange]: { params: number };
  [GridEvents.filterModelChange]: { params: GridFilterModel };
  [GridEvents.sortModelChange]: { params: GridSortModel };
  [GridEvents.editRowsModelChange]: { params: GridEditRowsModel };
  [GridEvents.selectionChange]: { params: GridSelectionModel };
}

export interface GridEventLookup
  extends GridRowEventLookup,
    GridColumnHeaderEventLookup,
    GridCellEventLookup,
    GridControlledStateEventLookup {
  [GridEvents.unmount]: {};
  [GridEvents.componentError]: { params: any };
  [GridEvents.stateChange]: { params: GridState };
  [GridEvents.resize]: { params: ElementSize };
  [GridEvents.debouncedResize]: { params: ElementSize };
  [GridEvents.rowGroupsPreProcessingChange]: {};
  [GridEvents.columnsPreProcessingChange]: {};

  // Columns
  [GridEvents.columnsChange]: { params: string[] }
  [GridEvents.columnWidthChange]: { params: GridColumnResizeParams; event: MouseEvent | {} };
  [GridEvents.columnResizeStart]: {
    params: { field: string };
    event: React.MouseEvent<HTMLDivElement>;
  };
  [GridEvents.columnResizeStop]: { params: null; event: MouseEvent };
  [GridEvents.columnVisibilityChange]: { params: GridColumnVisibilityChangeParams };
  [GridEvents.columnResize]: { params: GridColumnResizeParams; event: MouseEvent };
  [GridEvents.columnOrderChange]: { params: GridColumnOrderChangeParams  }

  // Rows
  [GridEvents.rowsSet]: {},
  [GridEvents.visibleRowsSet]: {},

  // Edit
  [GridEvents.cellModeChange]: { params: GridCellParams };
  [GridEvents.cellEditStart]: {
    params: GridCellParams;
    event: React.MouseEvent | React.KeyboardEvent;
  };
  [GridEvents.cellEditStop]: { params: GridCellParams; event: MuiBaseEvent };
  [GridEvents.cellEditCommit]: { params: GridCellEditCommitParams; event: MuiBaseEvent };
  [GridEvents.editCellPropsChange]: {
    params: GridEditCellPropsParams;
    event: React.SyntheticEvent | {};
  };
  [GridEvents.rowEditStart]: {
    params: GridRowParams;
    event: React.MouseEvent | React.KeyboardEvent;
  };
  [GridEvents.rowEditStop]: { params: GridRowParams; event: MuiBaseEvent };
  [GridEvents.rowEditCommit]: { params: GridRowId; event: MuiBaseEvent };

  // Focus
  [GridEvents.cellFocusIn]: { params: GridCellParams };
  [GridEvents.cellFocusOut]: { params: GridCellParams; event: MuiBaseEvent };

  // Navigation
  [GridEvents.cellNavigationKeyDown]: {
    params: GridCellParams | GridRowParams;
    event: React.KeyboardEvent;
  };
  [GridEvents.columnHeaderNavigationKeyDown]: {
    params: GridColumnHeaderParams;
    event: React.KeyboardEvent;
  };

  // Scroll
  [GridEvents.rowsScroll]: { params: GridScrollParams }
  [GridEvents.rowsScrollEnd]: { params: GridRowScrollEndParams }

  // Selection
  [GridEvents.headerSelectionCheckboxChange]: { params: GridHeaderSelectionCheckboxParams },
  [GridEvents.rowSelectionCheckboxChange]: { params: GridRowSelectionCheckboxParams },
}

export type GridEventsWithFullTyping = keyof GridEventLookup;

type PublisherArgsNoEvent<E extends GridEventsWithFullTyping, T extends { params: any }> = [
  E,
  T['params'],
];
type PublisherArgsRequiredEvent<
  E extends GridEventsWithFullTyping,
  T extends { params: any; event: MuiBaseEvent },
> = [E, T['params'], T['event']];
type PublisherArgsOptionalEvent<
  E extends GridEventsWithFullTyping,
  T extends { params: any; event: MuiBaseEvent },
> = PublisherArgsRequiredEvent<E, T> | PublisherArgsNoEvent<E, T>;

type PublisherArgsEvent<
  E extends GridEventsWithFullTyping,
  T extends { params: any; event: MuiBaseEvent },
> = {} extends T['event'] ? PublisherArgsOptionalEvent<E, T> : PublisherArgsRequiredEvent<E, T>;

type PublisherArgsParams<E extends GridEventsWithFullTyping, T extends { params: any }> = [
  E,
  T['params'],
];

type PublisherArgsNoParams<E extends GridEventsWithFullTyping> = [E];

type GridEventPublisherArg<E extends GridEventsWithFullTyping> = GridEventLookup[E] extends {
  params: any;
  event: MuiBaseEvent;
}
  ? PublisherArgsEvent<E, GridEventLookup[E]>
  : GridEventLookup[E] extends { params: any }
  ? PublisherArgsParams<E, GridEventLookup[E]>
  : PublisherArgsNoParams<E>;

export type GridEventPublisher = <E extends GridEvents>(
  ...params: GridEventPublisherArg<E>
) => void;

export type GridEventTypedListener<E extends GridEventsWithFullTyping> = (
  params: GridEventLookup[E] extends { params: any } ? GridEventLookup[E]['params'] : undefined,
  event: GridEventLookup[E] extends { event: MuiBaseEvent }
    ? MuiEvent<GridEventLookup[E]['event']>
    : MuiEvent<{}>,
  details: GridCallbackDetails,
) => void;

export type GridEventListener<Params, Event extends MuiEvent> = (
  params: Params,
  event: Event,
  details: GridCallbackDetails,
) => void;
