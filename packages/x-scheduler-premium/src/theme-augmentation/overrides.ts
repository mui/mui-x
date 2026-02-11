import { EventTimelinePremiumClassKey } from '../event-timeline-premium/eventTimelinePremiumClasses';

// prettier-ignore
export interface SchedulerPremiumComponentNameToClassKey {
  MuiEventTimeline: EventTimelinePremiumClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends SchedulerPremiumComponentNameToClassKey {}
}

// disable automatic export
export {};
