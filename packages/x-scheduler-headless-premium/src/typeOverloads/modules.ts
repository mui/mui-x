import type { EventDropDataLookup } from '@mui/x-scheduler-headless/internals';
import type { TimelinePremiumEvent } from '../timeline-premium/event/TimelinePremiumEvent';
import type { TimelinePremiumEventResizeHandler } from '../timeline-premium/event-resize-handler/TimelinePremiumEventResizeHandler';

declare module '@mui/x-scheduler-headless/internals' {
  interface EventDropDataLookup {
    TimelinePremiumEvent: TimelinePremiumEvent.DragData;
    TimelinePremiumEventResizeHandler: TimelinePremiumEventResizeHandler.DragData;
  }
}

export type { EventDropDataLookup };
