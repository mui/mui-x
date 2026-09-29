import { Draggable } from '@base-ui/react/draggable';
import type {
  SchedulerEventId,
  SchedulerEventOccurrence,
  SchedulerEventSide,
  SchedulerResourceId,
  SchedulerOccurrencePlaceholderExternalDragData,
  TemporalSupportedObject,
} from '../../models';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';
import type { CalendarGridDayEventResizeHandler } from '../../calendar-grid/day-event-resize-handler/CalendarGridDayEventResizeHandler';
import type { CalendarGridTimeEvent } from '../../calendar-grid/time-event/CalendarGridTimeEvent';
import type { CalendarGridTimeEventResizeHandler } from '../../calendar-grid/time-event-resize-handler/CalendarGridTimeEventResizeHandler';

/** Identifies the occurrence an event move or resize started from. */
export interface SchedulerEventDragPayload {
  eventId: SchedulerEventId;
  occurrenceKey: string;
}

/** The snapshot captured when an event move or resize starts. */
export interface SchedulerEventDragData {
  originalOccurrence: SchedulerEventOccurrence;
  start: TemporalSupportedObject;
  end: TemporalSupportedObject;
  /**
   * The id of the resource row the occurrence was dragged from.
   * Only rows that know which resource they represent, such as the Event Timeline Premium, report it.
   */
  sourceResourceId?: SchedulerResourceId;
}

/**
 * The snapshot of an event dragged on a surface where the pointer maps to a date along one axis,
 * such as a day column or a timeline row.
 */
export interface SchedulerAxisEventDragData extends SchedulerEventDragData {
  /**
   * How far from the start of the event the pointer grabbed it, in milliseconds of the axis.
   */
  initialCursorPositionInEventMs: number;
}

/** The snapshot captured when an event resize starts. */
export interface SchedulerEventResizeDragData extends SchedulerEventDragData {
  side: SchedulerEventSide;
}

/** The snapshot captured when an event resize starts on an axis surface. */
export interface SchedulerAxisEventResizeDragData extends SchedulerAxisEventDragData {
  side: SchedulerEventSide;
}

/** Data supplied by an external draggable that creates an event in Scheduler. */
export interface SchedulerExternalEventDragPayload {
  /** Event properties and optional duration in minutes. Scheduler supplies the drop dates. */
  eventData: SchedulerOccurrencePlaceholderExternalDragData;
  /** Called after Scheduler handles the drop. Use it to remove the item from its source list. */
  onEventDrop?: () => void;
}

export function createSchedulerEventKind<TData extends SchedulerEventDragData>(name: string) {
  return Draggable.createKind<SchedulerEventDragPayload, TData>(`scheduler-${name}`);
}

export const schedulerDayEventMoveKind =
  createSchedulerEventKind<CalendarGridDayEvent.DragData>('day-event-move');
export const schedulerTimeEventMoveKind =
  createSchedulerEventKind<CalendarGridTimeEvent.DragData>('time-event-move');
export const schedulerDayEventResizeKind =
  createSchedulerEventKind<CalendarGridDayEventResizeHandler.DragData>('day-event-resize');
export const schedulerTimeEventResizeKind =
  createSchedulerEventKind<CalendarGridTimeEventResizeHandler.DragData>('time-event-resize');

// A global kind, unlike the others: the source is often a consumer's own draggable, possibly
// bundled separately from the Scheduler targets that accept it.
export const schedulerExternalEventKind = Draggable.createGlobalKind<
  SchedulerExternalEventDragPayload,
  never
>('@mui/x-scheduler/external-event');

/** The kinds of the events dragged out of the calendar grids. */
export const schedulerEventMoveKinds = [schedulerDayEventMoveKind, schedulerTimeEventMoveKind];

/** Marks every Scheduler drop target, whatever it accepts. */
export const schedulerDropTargetKind = Draggable.createKind('scheduler-target');
