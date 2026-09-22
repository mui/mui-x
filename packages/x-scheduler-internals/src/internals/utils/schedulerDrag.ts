import { Draggable } from '@base-ui/react/draggable';
import type {
  EventSurfaceType,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '../../models';
import type { StandaloneEvent } from '../../standalone-event';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';
import type { CalendarGridDayEventResizeHandler } from '../../calendar-grid/day-event-resize-handler/CalendarGridDayEventResizeHandler';
import type { CalendarGridTimeEvent } from '../../calendar-grid/time-event/CalendarGridTimeEvent';
import type { CalendarGridTimeEventResizeHandler } from '../../calendar-grid/time-event-resize-handler/CalendarGridTimeEventResizeHandler';

interface EventDropDataLookupBase {
  CalendarGridTimeEvent: CalendarGridTimeEvent.DragData;
  CalendarGridTimeEventResizeHandler: CalendarGridTimeEventResizeHandler.DragData;
  CalendarGridDayEvent: CalendarGridDayEvent.DragData;
  CalendarGridDayEventResizeHandler: CalendarGridDayEventResizeHandler.DragData;
  StandaloneEvent: StandaloneEvent.DragData;
}

export interface EventDropDataLookup extends EventDropDataLookupBase {}

export type EventDropData = EventDropDataLookup[keyof EventDropDataLookup];

export type SchedulerEventResizeData = Extract<EventDropData, { side: SchedulerEventSide }>;
export type SchedulerEventMoveData = Exclude<
  EventDropData,
  SchedulerEventResizeData | StandaloneEvent.DragData
>;
export type SchedulerEventDragData = SchedulerEventMoveData | SchedulerEventResizeData;
export type SchedulerEventDragPayload<
  TData extends SchedulerEventDragData = SchedulerEventDragData,
> = Pick<TData, 'source' | 'eventId' | 'occurrenceKey'>;

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
// Premium contributes these snapshot types through EventDropDataLookup.
export const schedulerTimelineEventMoveKind =
  createEventKind<Extract<EventDropData, { source: 'TimelineGridEvent' }>>('timeline-event-move');
export const schedulerTimelineEventResizeKind =
  createEventKind<Extract<EventDropData, { source: 'TimelineGridEventResizeHandler' }>>(
    'timeline-event-resize',
  );
export const schedulerExternalEventKind = Draggable.createGlobalKind<
  StandaloneEvent.DragData,
  never
>('@mui/x-scheduler/external-event');
export const schedulerDependencyKind = Draggable.createGlobalKind<SchedulerDependencyDragPayload>(
  '@mui/x-scheduler/dependency',
);

export const schedulerEventMoveKinds = [
  schedulerDayEventMoveKind,
  schedulerTimeEventMoveKind,
  schedulerTimelineEventMoveKind,
];
export const schedulerEventResizeKinds = [
  schedulerDayEventResizeKind,
  schedulerTimeEventResizeKind,
  schedulerTimelineEventResizeKind,
];
export const schedulerEventDragKinds = [
  ...schedulerEventMoveKinds,
  ...schedulerEventResizeKinds,
  schedulerExternalEventKind,
];
export const schedulerDragKinds = [...schedulerEventDragKinds, schedulerDependencyKind];

export const schedulerDropTargetKind = Draggable.createGlobalKind<{
  surfaceType: EventSurfaceType;
}>('@mui/x-scheduler/target');
export const schedulerDependencyTargetKind =
  Draggable.createGlobalKind<SchedulerDependencyTargetPayload>(
    '@mui/x-scheduler/dependency-target',
  );
