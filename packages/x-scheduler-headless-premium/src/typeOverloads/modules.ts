import type { EventDropDataLookup } from '@mui/x-scheduler-headless/internals';
import type { TimelineEvent } from '../timeline/event/TimelineEvent';
import type { TimelineEventResizeHandler } from '../timeline/event-resize-handler/TimelineEventResizeHandler';

declare module '@mui/x-scheduler-headless/internals' {
  interface EventDropDataLookup {
    TimelineEvent: TimelineEvent.DragData;
    TimelineEventResizeHandler: TimelineEventResizeHandler.DragData;
  }
}

export type { EventDropDataLookup };
