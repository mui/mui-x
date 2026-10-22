import type { EventCalendarState as State } from '../use-event-calendar';
import type { SchedulerProcessedDate, TemporalSupportedObject } from '../models';
import type { Adapter } from '../use-adapter/useAdapter.types';
import { getProcessedDayNumber } from '../internals/utils/drag-utils';
import { toLocalDayNumber } from '../internals/utils/plain-date-utils/timeZone';

// These selectors run for every cell while dragging, so they compare timestamps and day numbers,
// which are cheaper than the adapter's comparison methods and than plain dates.

function getDayNumber(adapter: Adapter, date: TemporalSupportedObject): number {
  return toLocalDayNumber(adapter.getTime(date), adapter.getTimezone(date));
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
    const dayNumber = getProcessedDayNumber(adapter, day);
    if (dayNumber === getDayNumber(adapter, placeholder.start)) {
      return placeholder;
    }

    // A placeholder starting in a previous row also renders from the first day of this one.
    if (dayNumber === getDayNumber(adapter, rowStart)) {
      // Inclusive, in either order, like the adapter's `isWithinRange()`.
      const rowStartTimestamp = adapter.getTime(rowStart);
      const startTimestamp = adapter.getTime(placeholder.start);
      const endTimestamp = adapter.getTime(placeholder.end);
      if (
        Math.min(startTimestamp, endTimestamp) <= rowStartTimestamp &&
        rowStartTimestamp <= Math.max(startTimestamp, endTimestamp)
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
    if (
      adapter.getTime(placeholder.end) <= adapter.getTime(start) ||
      adapter.getTime(placeholder.start) >= adapter.getTime(end)
    ) {
      return null;
    }

    return placeholder;
  },
  isCreatingInDayCell: (state: State, day: SchedulerProcessedDate) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return (
      getProcessedDayNumber(state.adapter, day) === getDayNumber(state.adapter, placeholder.start)
    );
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
    if (getDayNumber(adapter, placeholder.start) !== getDayNumber(adapter, dayStart)) {
      return false;
    }

    const startsBeforeEnd = adapter.getTime(placeholder.start) < adapter.getTime(dayEnd);
    const endsAfterStart = adapter.getTime(placeholder.end) > adapter.getTime(dayStart);

    return startsBeforeEnd && endsAfterStart;
  },
};
