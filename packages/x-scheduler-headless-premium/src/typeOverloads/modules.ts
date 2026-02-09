import type { EventDropDataLookup } from '@mui/x-scheduler-headless/internals';
import type { EventTimelinePremiumEvent } from '../event-timeline-premium/event/EventTimelinePremiumEvent';
import type { EventTimelinePremiumEventResizeHandler } from '../event-timeline-premium/event-resize-handler/EventTimelinePremiumEventResizeHandler';

declare module '@mui/x-scheduler-headless/internals' {
  interface EventDropDataLookup {
    EventTimelinePremiumEvent: EventTimelinePremiumEvent.DragData;
    EventTimelinePremiumEventResizeHandler: EventTimelinePremiumEventResizeHandler.DragData;
  }
}

export type { EventDropDataLookup };
