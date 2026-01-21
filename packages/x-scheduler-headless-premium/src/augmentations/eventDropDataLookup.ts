import type { TimelineEvent } from '../timeline/event/TimelineEvent';
import type { TimelineEventResizeHandler } from '../timeline/event-resize-handler/TimelineEventResizeHandler';

declare module '@mui/x-scheduler-headless/build-is-valid-drop-target' {
  interface EventDropDataLookup {
    TimelineEvent: TimelineEvent.DragData;
    TimelineEventResizeHandler: TimelineEventResizeHandler.DragData;
  }
}

export {};
