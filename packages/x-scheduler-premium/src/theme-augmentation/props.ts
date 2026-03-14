import { EventTimelinePremiumProps } from '../event-timeline-premium/EventTimelinePremium.types';

export interface SchedulerPremiumComponentsPropsList {
  MuiEventTimeline: EventTimelinePremiumProps<any, any>;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends SchedulerPremiumComponentsPropsList {}
}

// disable automatic export
export {};
