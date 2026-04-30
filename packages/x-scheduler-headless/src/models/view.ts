import type { EventCalendarState } from '../use-event-calendar';
import type { TemporalSupportedObject } from '../base-ui-copy/types';
import type { SchedulerEventOccurrence, SchedulerProcessedDate } from './event';
import type { SchedulerOccurrencesByDay } from './occurrences';
import type { Adapter } from '../use-adapter/useAdapter.types';

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';

/**
 * Predicate deciding whether an occurrence should be assigned a lane in the
 * day-grid / time-grid layouts. Occurrences that return `false` are omitted from
 * positioning (and from rendering on that surface).
 */
export type EventCalendarShouldAddPosition = (
  occurrence: SchedulerEventOccurrence,
  adapter: Adapter,
) => boolean;

/**
 * Configuration defined by each view.
 *
 * Position selectors (day-grid / time-grid) are derived from this config by the
 * `eventCalendarOccurrencePositionSelectors` module — there's no per-view factory
 * boilerplate. Day/Week/Month views just declare `dayGrid` / `timeGrid` blocks with
 * the predicates they care about.
 */
export interface EventCalendarViewConfig {
  siblingVisibleDateGetter: (
    parameters: SiblingVisibleDateGetterParameters,
  ) => TemporalSupportedObject;
  /**
   * Returns the visible days for the view, in render order.
   */
  visibleDaysSelector: (state: EventCalendarState) => SchedulerProcessedDate[];
  /**
   * Optionally groups the visible days into rows for the day-grid layout. Multi-day
   * events keep their lane within a row but RESTART their lane on the first day of
   * each new row (so e.g. a Sun→Wed event renders visibly again on the next week's
   * Sunday in Month view).
   *
   * When omitted, the entire visible days list is treated as a single row — the right
   * default for Day/Week views (their day-grid is the all-day strip and lives in one row).
   */
  visibleRowsSelector?: (state: EventCalendarState) => SchedulerProcessedDate[][];
  /**
   * Optional override for the occurrences index. The default is built from
   * `visibleDaysSelector` and the scheduler's events. Agenda overrides this so the
   * occurrence-by-day computation is shared with `visibleDaysSelector` (see the
   * agenda combined selector).
   */
  visibleOccurrencesSelector?: (state: EventCalendarState) => SchedulerOccurrencesByDay;
  /**
   * Declares that the view exposes a day-grid layout (Month view, Day/Week all-day
   * strip). The framework builds and memoizes the position selector for you.
   * Omit for views that don't need a day-grid (Agenda).
   */
  dayGrid?: {
    /**
     * Filter — only occurrences passing the predicate get a lane in the day-grid.
     * Defaults to "all visible occurrences".
     */
    shouldAddPosition?: EventCalendarShouldAddPosition;
  };
  /**
   * Declares that the view exposes a time-grid layout (Day/Week views' timed area).
   * Omit for views that don't need a time-grid (Month, Agenda).
   */
  timeGrid?: {
    /**
     * Filter — only occurrences passing the predicate get a lane in the time-grid.
     * Defaults to "all visible occurrences".
     */
    shouldAddPosition?: EventCalendarShouldAddPosition;
    /**
     * Maximum number of lanes a single occurrence is allowed to span (default 1).
     */
    maxSpan?: number;
  };
}

interface SiblingVisibleDateGetterParameters {
  state: EventCalendarState;
  delta: 1 | -1;
}
