import * as React from 'react';
import { MuiBaseEvent, MuiEvent } from '../muiEvent';
import { GridCallbackDetails } from './gridCallbackDetails';
import { GridEvents } from '../../constants';
import { GridFilterModel } from '../gridFilterModel';
import { GridSortModel } from '../gridSortModel';
import type { GridColumnResizeParams, GridRowParams } from '../params';
import { GridEditRowsModel } from '../gridEditRowModel';
import { GridSelectionModel } from '../gridSelectionModel';

export interface GridRowEventLookup {
  [GridEvents.rowClick]: { params: GridRowParams; event: React.MouseEvent<HTMLDivElement> };
  [GridEvents.rowDoubleClick]: { params: GridRowParams; event: React.MouseEvent<HTMLDivElement> };
}

export interface GridControlledStateEventLookup {
  [GridEvents.pageSizeChange]: { params: number; event: {} };
  [GridEvents.pageChange]: { params: number; event: {} };
  [GridEvents.filterModelChange]: { params: GridFilterModel; event: {} };
  [GridEvents.sortModelChange]: { params: GridSortModel; event: {} };
  [GridEvents.editRowsModelChange]: { params: GridEditRowsModel; event: {} };
  [GridEvents.selectionChange]: { params: GridSelectionModel; event: {} };
}

export interface GridEventLookup extends GridRowEventLookup, GridControlledStateEventLookup {
  // Columns
  [GridEvents.columnWidthChange]: { params: GridColumnResizeParams; event: MouseEvent };
  [GridEvents.columnResizeStart]: {
    params: { field: string };
    event: React.MouseEvent<HTMLDivElement>;
  };
  [GridEvents.columnResizeStop]: { params: null; event: MouseEvent };
}

export type GridEventsWithFullTyping = keyof GridEventLookup;

type GridEventPublisherTypedArgWithEvent<E extends GridEventsWithFullTyping> = [
  E,
  GridEventLookup[E]['params'],
  MuiEvent<GridEventLookup[E]['event']>,
];

type GridEventPublisherTypedArgWithoutEvent<E extends GridEventsWithFullTyping> = [
  E,
  GridEventLookup[E]['params'],
];

type GridEventPublisherTypedArg<E extends GridEventsWithFullTyping> =
  GridEventLookup[E]['event'] extends Exclude<MuiBaseEvent, {}>
    ? GridEventPublisherTypedArgWithEvent<E>
    : GridEventPublisherTypedArgWithEvent<E> | GridEventPublisherTypedArgWithoutEvent<E>;

type GridEventPublisherArg<E extends GridEvents> = E extends GridEventsWithFullTyping
  ? GridEventPublisherTypedArg<E>
  : [E] | [E, any] | [E, any, MuiEvent | undefined];

export type GridEventPublisher = <E extends GridEvents>(
  ...params: GridEventPublisherArg<E>
) => void;

export type GridEventTypedListener<E extends GridEventsWithFullTyping> = (
  params: GridEventLookup[E]['params'],
  event: MuiEvent<GridEventLookup[E]['event']>,
  details: GridCallbackDetails,
) => void;

export type GridEventListener<Params, Event extends MuiEvent> = (
  params: Params,
  event: Event,
  details: GridCallbackDetails,
) => void;
