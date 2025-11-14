import { EventCalendarState } from '../use-event-calendar';
import { SchedulerValidDate } from './date';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

export type TimelineView = 'time' | 'days' | 'weeks' | 'months' | 'years';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface EventCalendarViewConfig {
  siblingVisibleDateGetter: (parameters: {
    state: EventCalendarState;
    delta: 1 | -1;
  }) => SchedulerValidDate;
}
