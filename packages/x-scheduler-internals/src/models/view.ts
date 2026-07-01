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
   * The first hour displayed in the view.
   * Must be a whole number between 0 and 24 (minutes are not supported).
   * @default 0
   */
  startTime?: number;
  /**
   * The last hour displayed in the view.
   * Must be a whole number between 0 and 24 (minutes are not supported).
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
