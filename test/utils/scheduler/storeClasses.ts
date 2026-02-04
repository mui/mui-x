import { EventCalendarStore } from '@mui/x-scheduler-headless/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import { EventTimelinePremiumStore } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';

/**
 * Store classes for general scheduler tests.
 * Includes both base and premium stores since they share base behavior.
 */
export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStore },
];

/**
 * Premium store classes for premium-specific tests (e.g., lazy loading).
 */
export const premiumStoreClasses = [
  { name: 'EventCalendarPremiumStore', Value: EventCalendarPremiumStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStore },
];
