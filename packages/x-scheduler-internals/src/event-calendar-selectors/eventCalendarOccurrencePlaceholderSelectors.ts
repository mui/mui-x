import type { EventCalendarState as State } from '../use-event-calendar';
import type { TemporalSupportedObject } from '../models';
import { getAdapterDayNumber } from '../internals/utils/drag-utils';

// These selectors run for every cell while dragging, so they compare timestamps and day numbers
// instead of calling the adapter's comparison methods.

export const eventCalendarOccurrencePlaceholderSelectors = {
  placeholderInDayCell: (
    state: State,
    day: TemporalSupportedObject,
    rowStart: TemporalSupportedObject,
  ) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder === null || placeholder.surfaceType !== 'day-grid' || placeholder.isHidden) {
      return null;
    }

    const { adapter } = state;
    const dayNumber = getAdapterDayNumber(adapter, day);
    if (dayNumber === getAdapterDayNumber(adapter, placeholder.start)) {
      return placeholder;
    }

    // A placeholder starting in a previous row also renders from the first day of this one.
    if (dayNumber === getAdapterDayNumber(adapter, rowStart)) {
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
  isCreatingInDayCell: (state: State, day: TemporalSupportedObject) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return (
      getAdapterDayNumber(state.adapter, day) ===
      getAdapterDayNumber(state.adapter, placeholder.start)
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
    if (
      getAdapterDayNumber(adapter, placeholder.start) !== getAdapterDayNumber(adapter, dayStart)
    ) {
      return false;
    }

    const startsBeforeEnd = adapter.getTime(placeholder.start) < adapter.getTime(dayEnd);
    const endsAfterStart = adapter.getTime(placeholder.end) > adapter.getTime(dayStart);

    return startsBeforeEnd && endsAfterStart;
  },
};
