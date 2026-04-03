import type { TemporalSupportedObject } from '@base-ui/react/internals/temporal';
import { EventCalendarState } from '../use-event-calendar';
import { SchedulerProcessedDate } from './event';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

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
