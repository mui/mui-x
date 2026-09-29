import { Draggable } from '@base-ui/react/draggable';
import {
  createSchedulerEventKind,
  schedulerEventMoveKinds as calendarEventMoveKinds,
} from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import type { TimelineGridEvent } from '../../timeline-grid/event/TimelineGridEvent';
import type { TimelineGridEventResizeHandler } from '../../timeline-grid/event-resize-handler/TimelineGridEventResizeHandler';

export const schedulerTimelineEventMoveKind =
  createSchedulerEventKind<TimelineGridEvent.DragData>('timeline-event-move');
export const schedulerTimelineEventResizeKind =
  createSchedulerEventKind<TimelineGridEventResizeHandler.DragData>('timeline-event-resize');

/** The kinds of the events dragged out of the calendar grids and the timeline. */
export const schedulerEventMoveKinds = [...calendarEventMoveKinds, schedulerTimelineEventMoveKind];

/** Identifies the terminal a create-dependency drag started from. */
export interface SchedulerDependencyDragPayload {
  eventId: SchedulerEventId;
  occurrenceKey: string;
  /**
   * The resource of the row appearance the terminal is anchored on. An event assigned to
   * several resources repeats the same occurrence key on each of its rows.
   */
  resourceId: SchedulerResourceId;
  sourceSide: SchedulerEventSide;
}

/** Identifies the event edge a create-dependency drag can land on. */
export interface SchedulerDependencyTargetPayload {
  eventId: SchedulerEventId;
  occurrenceKey: string;
  resourceId: SchedulerResourceId;
  /**
   * The edge of the target the drop lands on: the hovered terminal's, or the start
   * edge on the event body.
   */
  side: SchedulerEventSide;
  /**
   * `false` for a recurring or read-only event: hovering it gives no highlight or
   * snap, but a drop still goes through `addDependency` so its rejection reaches the
   * user.
   */
  isValid: boolean;
}

export const schedulerDependencyTargetKind = Draggable.createKind<SchedulerDependencyTargetPayload>(
  'scheduler-dependency-target',
);
