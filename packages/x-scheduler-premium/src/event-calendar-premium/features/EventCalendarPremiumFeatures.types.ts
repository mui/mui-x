import type { SchedulerRecurringEventsFeature } from '../../internals/features/SchedulerRecurringEventsFeature.types';

export interface EventCalendarPremiumFeatures {
  /**
   * Recurring events support. Import it from `@mui/x-scheduler-premium/recurring-events`.
   */
  recurringEvents?: SchedulerRecurringEventsFeature;
}
