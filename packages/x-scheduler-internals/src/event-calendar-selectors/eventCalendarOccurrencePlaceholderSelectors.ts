import type { EventCalendarState as State } from '../use-event-calendar';
import type { SchedulerProcessedDay } from '../models';
import type { BaseTemporal } from '../internals/utils/base-temporal';
import { getDayNumber } from '../internals/utils/plain-date-utils/plainDate';
import { toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

// These selectors run for every cell while dragging, so they compare timestamps and day numbers.

export const eventCalendarOccurrencePlaceholderSelectors = {
  placeholderInDayCell: (state: State, day: SchedulerProcessedDay, rowStart: number) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'day-grid' || placeholder.isHidden) {
      return null;
    }

    const dayNumber = getDayNumber(day.plainDate);
    if (dayNumber === toLocalDayNumber(placeholder.start, state.displayTimezone)) {
      return placeholder;
    }

    // A placeholder starting in a previous row also renders from the first day of this one, when the
    // row starts within it (inclusive, in either order). The range is checked first, as it rules out
    // most cells.
    if (
      Math.min(placeholder.start, placeholder.end) <= rowStart &&
      rowStart <= Math.max(placeholder.start, placeholder.end) &&
      dayNumber === toLocalDayNumber(rowStart, state.displayTimezone)
    ) {
      return placeholder;
    }

    return null;
  },
  placeholderInTimeRange: (state: State, start: number, end: number) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'time-grid' || placeholder.isHidden) {
      return null;
    }

    if (placeholder.end <= start || placeholder.start >= end) {
      return null;
    }

    return placeholder;
  },
  isCreatingInDayCell: (state: State, day: SchedulerProcessedDay) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return (
      getDayNumber(day.plainDate) === toLocalDayNumber(placeholder.start, state.displayTimezone)
    );
  },
  isCreatingInTimeRange: (
    state: State,
    plainDate: BaseTemporal.PlainDate,
    dayStart: number,
    dayEnd: number,
  ) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'time-grid' || placeholder.type !== 'creation') {
      return false;
    }

    return (
      placeholder.start < dayEnd &&
      placeholder.end > dayStart &&
      getDayNumber(plainDate) === toLocalDayNumber(placeholder.start, state.displayTimezone)
    );
  },
};
