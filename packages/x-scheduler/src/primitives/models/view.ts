import { Adapter } from '../utils/adapter/types';
import { SchedulerValidDate } from './date';
import { CalendarProcessedDate } from './event';

// TODO: Remove "timeline" once it has its own top level component
export type CalendarView = 'week' | 'day' | 'month' | 'agenda' | 'timeline';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface CalendarViewConfig {
  siblingVisibleDateGetter: (parameters: SiblingVisibleDateGetterParameters) => SchedulerValidDate;
  renderEventIn: 'every-day';
  // TODO: Support updates
  getVisibleDays: (parameters: GetVisibleDaysParameters) => CalendarProcessedDate[];
}

interface SiblingVisibleDateGetterParameters {
  adapter: Adapter;
  date: SchedulerValidDate;
  delta: 1 | -1;
}

interface GetVisibleDaysParameters {
  adapter: Adapter;
  visibleDate: SchedulerValidDate;
  showWeekends: boolean;
}
