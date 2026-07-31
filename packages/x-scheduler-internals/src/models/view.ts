import type { EventCalendarState } from '../use-event-calendar';
import type { TemporalSupportedObject } from '../base-ui-copy/types';
import type { SchedulerProcessedDate } from './event';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

/**
 * Definition provided by each view.
 * This is used to determine how the components outside of the view should behave based on the current view.
 */
export interface EventCalendarViewDefinition {
  siblingVisibleDateGetter: (
    parameters: SiblingVisibleDateGetterParameters,
  ) => TemporalSupportedObject;
  visibleDaysSelector: (state: EventCalendarState) => SchedulerProcessedDate[];
}

interface SiblingVisibleDateGetterParameters {
  state: EventCalendarState;
  delta: 1 | -1;
}

/**
 * Per-view user configuration for the time-grid based views (`day` and `week`).
 */
export interface EventCalendarTimeGridViewConfig {
  /**
   * Inclusive start of the displayed hour range.
   * Must be a whole number between 0 and 23 and lower than `endTime`; otherwise the
   * full day is displayed and a warning is logged in development.
   * @default 0
   */
  startTime?: number;
  /**
   * Exclusive end of the displayed hour range: the last rendered hour cell is
   * `endTime - 1`, so `{ startTime: 8, endTime: 20 }` displays 08:00 → 19:59.
   * Must be a whole number between 1 and 24 and greater than `startTime`; otherwise
   * the full day is displayed and a warning is logged in development.
   * @default 24
   */
  endTime?: number;
}

/**
 * User configuration applied to each view, keyed by the view name.
 */
export interface EventCalendarViewConfig {
  /**
   * Configuration applied to the `day` view.
   */
  day?: EventCalendarTimeGridViewConfig;
  /**
   * Configuration applied to the `week` view.
   */
  week?: EventCalendarTimeGridViewConfig;
}
