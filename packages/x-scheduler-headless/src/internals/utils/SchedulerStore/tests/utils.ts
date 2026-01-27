import { EventTimelinePremiumStore } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import { EventCalendarStore } from '../../../../use-event-calendar';

/**
 * Store classes for general scheduler tests (without lazy loading).
 */
export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStore },
];

/**
 * Store classes for data source / lazy loading tests (premium only).
 */
export const premiumStoreClasses = [
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStore },
];
