import type { EventDropDataLookup } from '@mui/x-scheduler-internals/internals';
import type { TimelineGridEvent } from '../timeline-grid/event/TimelineGridEvent';
import type { TimelineGridEventResizeHandler } from '../timeline-grid/event-resize-handler/TimelineGridEventResizeHandler';

// The lookup only registers the drags producing an occurrence placeholder: the
// dependency-terminal drag stays out (its narrow, `isDependencyHandleDrag`, lives
// next to the terminal), so `EventDropData` keeps meaning "payload of a drag the
// placeholder pipeline handles".
declare module '@mui/x-scheduler-internals/internals' {
  interface EventDropDataLookup {
    TimelineGridEvent: TimelineGridEvent.DragData;
    TimelineGridEventResizeHandler: TimelineGridEventResizeHandler.DragData;
  }
}

export type { EventDropDataLookup };
