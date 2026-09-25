import type { EventDropDataLookup } from '@mui/x-scheduler-internals/internals';
import type { TimelineGridEvent } from '../timeline-grid/event/TimelineGridEvent';
import type { TimelineGridEventResizeHandler } from '../timeline-grid/event-resize-handler/TimelineGridEventResizeHandler';

// Only event moves and resizes produce occurrence placeholders. Dependency drags
// use their own kind and do not enter the placeholder pipeline.
declare module '@mui/x-scheduler-internals/internals' {
  interface EventDropDataLookup {
    TimelineGridEvent: TimelineGridEvent.DragData;
    TimelineGridEventResizeHandler: TimelineGridEventResizeHandler.DragData;
  }
}

export type { EventDropDataLookup };
