import { SchedulerValidDate } from './date';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface CalendarViewConfig {
  siblingVisibleDateGetter: (date: SchedulerValidDate, delta: 1 | -1) => SchedulerValidDate;
}
