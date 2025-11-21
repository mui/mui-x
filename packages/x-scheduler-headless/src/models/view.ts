import { TemporalAdapter } from '../base-ui-copy/types';
import { EventCalendarState } from '../use-event-calendar';
import { SchedulerValidDate } from './date';
import { SchedulerProcessedDate, SchedulerProcessedEvent } from './event';
import { EventCalendarPreferences } from './preferences';
import { SchedulerResourceId } from './resource';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

export type TimelineView = 'time' | 'days' | 'weeks' | 'months' | 'years';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface EventCalendarViewConfig {
  siblingVisibleDateGetter: (parameters: SiblingVisibleDateGetterParameters) => SchedulerValidDate;
  getVisibleDays: (parameters: GetVisibleDaysParameters) => SchedulerProcessedDate[];
}

interface SiblingVisibleDateGetterParameters {
  state: EventCalendarState;
  delta: 1 | -1;
}

interface GetVisibleDaysParameters {
  adapter: TemporalAdapter;
  visibleDate: SchedulerValidDate;
  preferences: EventCalendarPreferences;
  /**
   * TODO: Remove
   */
  events: SchedulerProcessedEvent[];
  /**
   * TODO: Remove
   */
  visibleResources: Map<SchedulerResourceId, boolean>;
  /**
   * TODO: Remove
   */
  resourceParentIds: Map<SchedulerResourceId, SchedulerResourceId | null>;
}
