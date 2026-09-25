import { Draggable } from '@base-ui/react/draggable';
import type {
  EventSurfaceType,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
  SchedulerOccurrencePlaceholderExternalDragData,
} from '../../models';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';
import type { CalendarGridDayEventResizeHandler } from '../../calendar-grid/day-event-resize-handler/CalendarGridDayEventResizeHandler';
import type { CalendarGridTimeEvent } from '../../calendar-grid/time-event/CalendarGridTimeEvent';
import type { CalendarGridTimeEventResizeHandler } from '../../calendar-grid/time-event-resize-handler/CalendarGridTimeEventResizeHandler';

interface EventDropDataLookupBase {
  CalendarGridTimeEvent: CalendarGridTimeEvent.DragData;
  CalendarGridTimeEventResizeHandler: CalendarGridTimeEventResizeHandler.DragData;
  CalendarGridDayEvent: CalendarGridDayEvent.DragData;
  CalendarGridDayEventResizeHandler: CalendarGridDayEventResizeHandler.DragData;
  ExternalEvent: SchedulerExternalEventDragPayload;
}

export interface EventDropDataLookup extends EventDropDataLookupBase {}

export type EventDropData = EventDropDataLookup[keyof EventDropDataLookup];

export type SchedulerEventResizeData = Extract<EventDropData, { side: SchedulerEventSide }>;
export type SchedulerEventMoveData = Exclude<
  EventDropData,
  SchedulerEventResizeData | SchedulerExternalEventDragPayload
>;
export type SchedulerEventDragData = SchedulerEventMoveData | SchedulerEventResizeData;
export type SchedulerEventDragPayload<
  TData extends SchedulerEventDragData = SchedulerEventDragData,
> = Pick<TData, 'source' | 'eventId' | 'occurrenceKey'>;

/** Data supplied by an external draggable that creates an event in Scheduler. */
export interface SchedulerExternalEventDragPayload {
  /** Event properties and optional duration in minutes. Scheduler supplies the drop dates. */
  eventData: SchedulerOccurrencePlaceholderExternalDragData;
  /** Called after Scheduler handles the drop. Use it to remove the item from its source list. */
  onEventDrop?: () => void;
}

export interface SchedulerDependencyDragPayload {
  eventId: SchedulerEventId;
  occurrenceKey: string;
  resourceId: SchedulerResourceId;
  sourceSide: SchedulerEventSide;
  storeContext: unknown;
}

export interface SchedulerDependencyTargetPayload {
  dependencyTargetEventId: SchedulerEventId;
  dependencyTargetOccurrenceKey: string;
  dependencyTargetResourceId: SchedulerResourceId;
  dependencyTargetSide: SchedulerEventSide;
  dependencyTargetIsValid: boolean;
}

// Global kinds let separately mounted calendars, timelines, and external events interact.
function createEventKind<TData extends SchedulerEventDragData>(key: string) {
  return Draggable.createGlobalKind<SchedulerEventDragPayload<TData>, TData>(
    `@mui/x-scheduler/${key}`,
  );
}

export const schedulerDayEventMoveKind =
  createEventKind<CalendarGridDayEvent.DragData>('day-event-move');
export const schedulerTimeEventMoveKind =
  createEventKind<CalendarGridTimeEvent.DragData>('time-event-move');
export const schedulerDayEventResizeKind =
  createEventKind<CalendarGridDayEventResizeHandler.DragData>('day-event-resize');
export const schedulerTimeEventResizeKind =
  createEventKind<CalendarGridTimeEventResizeHandler.DragData>('time-event-resize');
// Keep the lookup in the declaration so premium can augment it after this package is built.
export const schedulerTimelineEventMoveKind: Draggable.Kind<
  SchedulerEventDragPayload<Extract<EventDropData, { source: 'TimelineGridEvent' }>>,
  Extract<EventDropData, { source: 'TimelineGridEvent' }>
> = createEventKind('timeline-event-move');
export const schedulerTimelineEventResizeKind: Draggable.Kind<
  SchedulerEventDragPayload<Extract<EventDropData, { source: 'TimelineGridEventResizeHandler' }>>,
  Extract<EventDropData, { source: 'TimelineGridEventResizeHandler' }>
> = createEventKind('timeline-event-resize');
export const schedulerExternalEventKind = Draggable.createGlobalKind<
  SchedulerExternalEventDragPayload,
  never
>('@mui/x-scheduler/external-event');
export const schedulerDependencyKind = Draggable.createGlobalKind<SchedulerDependencyDragPayload>(
  '@mui/x-scheduler/dependency',
);

export const schedulerEventMoveKinds: (
  | typeof schedulerDayEventMoveKind
  | typeof schedulerTimeEventMoveKind
  | typeof schedulerTimelineEventMoveKind
)[] = [schedulerDayEventMoveKind, schedulerTimeEventMoveKind, schedulerTimelineEventMoveKind];
export const schedulerEventResizeKinds: (
  | typeof schedulerDayEventResizeKind
  | typeof schedulerTimeEventResizeKind
  | typeof schedulerTimelineEventResizeKind
)[] = [schedulerDayEventResizeKind, schedulerTimeEventResizeKind, schedulerTimelineEventResizeKind];
export const schedulerEventDragKinds: (
  | (typeof schedulerEventMoveKinds)[number]
  | (typeof schedulerEventResizeKinds)[number]
  | typeof schedulerExternalEventKind
)[] = [...schedulerEventMoveKinds, ...schedulerEventResizeKinds, schedulerExternalEventKind];
export const schedulerDragKinds: (
  (typeof schedulerEventDragKinds)[number] | typeof schedulerDependencyKind
)[] = [...schedulerEventDragKinds, schedulerDependencyKind];

export const schedulerDropTargetKind = Draggable.createGlobalKind<{
  surfaceType: EventSurfaceType;
}>('@mui/x-scheduler/target');
export const schedulerDependencyTargetKind =
  Draggable.createGlobalKind<SchedulerDependencyTargetPayload>(
    '@mui/x-scheduler/dependency-target',
  );
