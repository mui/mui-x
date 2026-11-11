import type { SchedulerRecurringEventsPluginInterface } from '@mui/x-scheduler-internals/internals';
import type { EventEditingOptionalRenderers } from '@mui/x-scheduler/internals';

/**
 * The value of `recurringEventsFeature`.
 * Its members are internal and can change: pass `recurringEventsFeature` as is.
 */
export interface SchedulerRecurringEventsFeature {
  /**
   * Expands the events with an `rrule` into occurrences.
   */
  store: SchedulerRecurringEventsPluginInterface;
  /**
   * The recurrence tab and the scope dialog of the event editing surfaces.
   */
  optionalRenderers: EventEditingOptionalRenderers;
}
