import type { EventCalendarState as State } from '../use-event-calendar';
import type { SchedulerProcessedDate } from '../models';
import { toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

// These selectors run for every cell while dragging, so they compare timestamps and day numbers,
// which are cheaper than the adapter's comparison methods and than plain dates.

// The placeholder and the bounds of the rows and columns are timestamps read in the display timezone.
function getDayNumber(state: State, timestamp: number): number {
  return toLocalDayNumber(timestamp, state.displayTimezone);
}

export const eventCalendarOccurrencePlaceholderSelectors = {
  placeholderInDayCell: (state: State, day: SchedulerProcessedDate, rowStart: number) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'day-grid' || placeholder.isHidden) {
      return null;
    }

    const dayNumber = getDayNumber(state, day.timestamp);
    if (dayNumber === getDayNumber(state, placeholder.start)) {
      return placeholder;
    }

    // A placeholder starting in a previous row also renders from the first day of this one.
    if (dayNumber === getDayNumber(state, rowStart)) {
      // Inclusive, in either order, like the adapter's `isWithinRange()`.
      if (
        Math.min(placeholder.start, placeholder.end) <= rowStart &&
        rowStart <= Math.max(placeholder.start, placeholder.end)
      ) {
        return placeholder;
      }
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
  isCreatingInDayCell: (state: State, day: SchedulerProcessedDate) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return getDayNumber(state, day.timestamp) === getDayNumber(state, placeholder.start);
  },
  isCreatingInTimeRange: (state: State, dayStart: number, dayEnd: number) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'time-grid' || placeholder.type !== 'creation') {
      return false;
    }

    if (getDayNumber(state, placeholder.start) !== getDayNumber(state, dayStart)) {
      return false;
    }

    const startsBeforeEnd = placeholder.start < dayEnd;
    const endsAfterStart = placeholder.end > dayStart;

    return startsBeforeEnd && endsAfterStart;
  },
};
