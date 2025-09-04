import { SchedulerValidDate } from './date';

// TODO: Remove "timeline" once it has its own top level component
export type CalendarView = 'week' | 'day' | 'month' | 'agenda' | 'timeline';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface CalendarViewConfig {
  siblingVisibleDateGetter: (date: SchedulerValidDate, delta: 1 | -1) => SchedulerValidDate;
}
