import { EventCalendarState } from '../use-event-calendar';
import type { TemporalSupportedObject } from '../base-ui-copy/types';
import { SchedulerProcessedDate } from './event';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface EventCalendarViewConfig {
  siblingVisibleDateGetter: (
    parameters: SiblingVisibleDateGetterParameters,
  ) => TemporalSupportedObject;
  visibleDaysSelector: (state: EventCalendarState) => SchedulerProcessedDate[];
}

interface SiblingVisibleDateGetterParameters {
  state: EventCalendarState;
  delta: 1 | -1;
}
