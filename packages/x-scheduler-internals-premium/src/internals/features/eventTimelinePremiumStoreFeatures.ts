import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';

/**
 * Optional features the timeline store receives at construction.
 * They are read once, later values are ignored.
 * @internal
 */
export interface EventTimelinePremiumStoreFeatures {
  /**
   * Expands the events with an `rrule` into occurrences.
   * Without it, the events render once.
   */
  recurringEvents?: SchedulerRecurringEventsPluginInterface;
}
