import { EventCalendarState } from '../use-event-calendar';
import { SchedulerValidDate } from './date';
import { SchedulerProcessedDate } from './event';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

export type TimelineView = 'time' | 'days' | 'weeks' | 'months' | 'years';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface EventCalendarViewConfig<GetVisibleDaysParameters extends object> {
  siblingVisibleDateGetter: (parameters: SiblingVisibleDateGetterParameters) => SchedulerValidDate;
  getVisibleDays: (parameters: GetVisibleDaysParameters) => SchedulerProcessedDate[];
  getVisibleDayParametersSelector: (state: EventCalendarState) => GetVisibleDaysParameters;
}

interface SiblingVisibleDateGetterParameters {
  state: EventCalendarState;
  delta: 1 | -1;
}
