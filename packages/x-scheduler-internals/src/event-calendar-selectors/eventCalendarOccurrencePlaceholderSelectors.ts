import type { EventCalendarState as State } from '../use-event-calendar';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import { toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

// These selectors run for every cell while dragging, so they compare timestamps and day numbers,
// which are cheaper than the adapter's comparison methods and than plain dates.

// The bounds of the views are in the display timezone, like the placeholder.
function getDayNumber(state: State, date: TemporalSupportedObject): number {
  return toLocalDayNumber(state.adapter.getTime(date), state.displayTimezone);
}

function getProcessedDayNumber(state: State, date: SchedulerProcessedDate): number {
  return toLocalDayNumber(date.timestamp, state.displayTimezone);
}

function getTimestampDayNumber(state: State, timestamp: number): number {
  return toLocalDayNumber(timestamp, state.displayTimezone);
}

export const eventCalendarOccurrencePlaceholderSelectors = {
  placeholderInDayCell: (
    state: State,
    day: SchedulerProcessedDate,
    rowStart: TemporalSupportedObject,
  ) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'day-grid' || placeholder.isHidden) {
      return null;
    }

    const { adapter } = state;
    const dayNumber = getProcessedDayNumber(state, day);
    if (dayNumber === getTimestampDayNumber(state, placeholder.start)) {
      return placeholder;
    }

    // A placeholder starting in a previous row also renders from the first day of this one.
    if (dayNumber === getDayNumber(state, rowStart)) {
      // Inclusive, in either order, like the adapter's `isWithinRange()`.
      const rowStartTimestamp = adapter.getTime(rowStart);
      if (
        Math.min(placeholder.start, placeholder.end) <= rowStartTimestamp &&
        rowStartTimestamp <= Math.max(placeholder.start, placeholder.end)
      ) {
        return placeholder;
      }
    }

    return null;
  },
  placeholderInTimeRange: (
    state: State,
    start: TemporalSupportedObject,
    end: TemporalSupportedObject,
  ) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'time-grid' || placeholder.isHidden) {
      return null;
    }

    const { adapter } = state;
    if (placeholder.end <= adapter.getTime(start) || placeholder.start >= adapter.getTime(end)) {
      return null;
    }

    return placeholder;
  },
  isCreatingInDayCell: (state: State, day: SchedulerProcessedDate) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return getProcessedDayNumber(state, day) === getTimestampDayNumber(state, placeholder.start);
  },
  isCreatingInTimeRange: (
    state: State,
    dayStart: TemporalSupportedObject,
    dayEnd: TemporalSupportedObject,
  ) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'time-grid' || placeholder.type !== 'creation') {
      return false;
    }

    const { adapter } = state;
    if (getTimestampDayNumber(state, placeholder.start) !== getDayNumber(state, dayStart)) {
      return false;
    }

    const startsBeforeEnd = placeholder.start < adapter.getTime(dayEnd);
    const endsAfterStart = placeholder.end > adapter.getTime(dayStart);

    return startsBeforeEnd && endsAfterStart;
  },
};
