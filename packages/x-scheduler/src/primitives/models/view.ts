import { Adapter } from '../utils/adapter/types';
import { SchedulerValidDate } from './date';
import {
  CalendarEventOccurrenceDayGridPosition,
  CalendarProcessedDate,
  OccurrencesGroupedByDayMap,
} from './event';

export type CalendarView = 'week' | 'day' | 'month' | 'agenda';

/**
 * Configuration defined by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface CalendarViewConfig {
  siblingVisibleDateGetter: (parameters: SiblingVisibleDateGetterParameters) => SchedulerValidDate;
  // TODO: Support updates
  getVisibleDays: (parameters: GetVisibleDaysParameters) => CalendarProcessedDate[];
  buildOccurrencesPositionLookup: (
    parameters: BuildOccurrencesPositionLookupParameters,
  ) => Map<string, { surfaceType: 'day-grid'; position: CalendarEventOccurrenceDayGridPosition }>;
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

export interface BuildOccurrencesPositionLookupParameters {
  /**
   * The date adapter to use.
   */
  adapter: Adapter;
  /**
   * The days to add the occurrences to.
   */
  days: CalendarProcessedDate[];
  /**
   * The occurrences Map as returned by `useEventOccurrences()`.
   * It should contain the occurrences for each requested day but can also contain occurrences for other days.
   */
  occurrencesMap: OccurrencesGroupedByDayMap;
}
