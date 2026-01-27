import { EventTimelinePremiumStore } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { EventCalendarStore } from '../../../../use-event-calendar';

/**
 * Store classes for general scheduler tests.
 * Includes both base and premium stores since they share base behavior.
 */
export const storeClasses = [
  { name: 'EventCalendarStore', Value: EventCalendarStore },
  { name: 'EventTimelinePremiumStore', Value: EventTimelinePremiumStore },
];
