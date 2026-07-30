import type { EventDropDataLookup } from '@mui/x-scheduler-internals/internals';
import type { TimelineGridEvent } from '../timeline-grid/event/TimelineGridEvent';
import type { TimelineGridEventResizeHandler } from '../timeline-grid/event-resize-handler/TimelineGridEventResizeHandler';
import type { TimelineGridEventDependencyHandler } from '../timeline-grid/event-dependency-handler/TimelineGridEventDependencyHandler';

declare module '@mui/x-scheduler-internals/internals' {
  interface EventDropDataLookup {
    TimelineGridEvent: TimelineGridEvent.DragData;
    TimelineGridEventResizeHandler: TimelineGridEventResizeHandler.DragData;
    TimelineGridEventDependencyHandler: TimelineGridEventDependencyHandler.DragData;
  }
}

export type { EventDropDataLookup };
