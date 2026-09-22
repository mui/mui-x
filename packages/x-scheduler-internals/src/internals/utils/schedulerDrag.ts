import { Draggable } from '@base-ui/react/draggable';
import type { EventDropData } from '../../build-is-valid-drop-target/buildIsValidDropTarget';
import type {
  EventSurfaceType,
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '../../models';
import type { StandaloneEvent } from '../../standalone-event';

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
export const schedulerEventMoveKind = Draggable.createGlobalKind<
  SchedulerEventDragPayload<SchedulerEventMoveData>,
  SchedulerEventMoveData
>('@mui/x-scheduler/event-move');
export const schedulerEventResizeKind = Draggable.createGlobalKind<
  SchedulerEventDragPayload<SchedulerEventResizeData>,
  SchedulerEventResizeData
>('@mui/x-scheduler/event-resize');
export const schedulerExternalEventKind = Draggable.createGlobalKind<
  StandaloneEvent.DragData,
  never
>('@mui/x-scheduler/external-event');
export const schedulerDependencyKind = Draggable.createGlobalKind<SchedulerDependencyDragPayload>(
  '@mui/x-scheduler/dependency',
);

export const schedulerEventDragKinds = [
  schedulerEventMoveKind,
  schedulerEventResizeKind,
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
