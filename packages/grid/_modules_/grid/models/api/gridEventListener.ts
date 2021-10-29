import * as React from 'react';
import { MuiBaseEvent, MuiEvent } from '../muiEvent';
import { GridCallbackDetails } from './gridCallbackDetails';
import { GridEvents } from '../../constants';
import { GridFilterModel } from '../gridFilterModel';
import { GridSortModel } from '../gridSortModel';
import type {
  GridColumnResizeParams,
  GridColumnVisibilityChangeParams,
  GridRowParams,
} from '../params';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridSelectionModel } from '../gridSelectionModel';
import { GridState } from '../gridState';
import { ElementSize } from '../elementSize';

export interface GridRowEventLookup {
  [GridEvents.rowClick]: { params: GridRowParams; event: React.MouseEvent<HTMLDivElement> };
  [GridEvents.rowDoubleClick]: { params: GridRowParams; event: React.MouseEvent<HTMLDivElement> };
}

export interface GridControlledStateEventLookup {
  [GridEvents.pageSizeChange]: { params: number };
  [GridEvents.pageChange]: { params: number };
  [GridEvents.filterModelChange]: { params: GridFilterModel };
  [GridEvents.sortModelChange]: { params: GridSortModel };
  [GridEvents.editRowsModelChange]: { params: GridEditRowsModel };
  [GridEvents.selectionChange]: { params: GridSelectionModel };
}

export interface GridEventLookup extends GridRowEventLookup, GridControlledStateEventLookup {
  [GridEvents.unmount]: {};
  [GridEvents.componentError]: { params: any };
  [GridEvents.stateChange]: { params: GridState };
  [GridEvents.resize]: { params: ElementSize };
  [GridEvents.debouncedResize]: { params: ElementSize };
  [GridEvents.rowGroupsPreProcessingChange]: {};
  [GridEvents.columnsPreProcessingChange]: {};

  // Columns
  // [GridEvents.columnsChange]
  [GridEvents.columnWidthChange]: { params: GridColumnResizeParams; event: MouseEvent | {} };
  [GridEvents.columnResizeStart]: {
    params: { field: string };
    event: React.MouseEvent<HTMLDivElement>;
  };
  [GridEvents.columnResizeStop]: { params: null; event: MouseEvent };
  [GridEvents.columnVisibilityChange]: { params: GridColumnVisibilityChangeParams };
  [GridEvents.columnResize]: { params: GridColumnResizeParams; event: MouseEvent };

  // Edit row
  // [GridEvents.cellModeChange]: { params: GridCellParams }
}

export type GridEventsWithFullTyping = keyof GridEventLookup;

export type GridEventsWithoutFullTyping = Exclude<GridEvents, GridEventsWithFullTyping>;

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

type GridEventPublisherTypedArg<E extends GridEventsWithFullTyping> = GridEventLookup[E] extends {
  params: any;
  event: MuiBaseEvent;
}
  ? PublisherArgsEvent<E, GridEventLookup[E]>
  : GridEventLookup[E] extends { params: any }
  ? PublisherArgsParams<E, GridEventLookup[E]>
  : PublisherArgsNoParams<E>;

type GridEventPublisherArg<E extends GridEvents> = E extends GridEventsWithFullTyping
  ? GridEventPublisherTypedArg<E>
  : [E] | [E, any] | [E, any, MuiEvent | undefined];

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
