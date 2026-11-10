import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';

/**
 * Optional features the calendar store receives at construction.
 * They are read once, later values are ignored.
 * @internal
 */
export interface EventCalendarPremiumStoreFeatures {
  /**
   * Expands the events with an `rrule` into occurrences.
   * Without it, the events render once.
   */
  recurringEvents?: SchedulerRecurringEventsPluginInterface;
}
