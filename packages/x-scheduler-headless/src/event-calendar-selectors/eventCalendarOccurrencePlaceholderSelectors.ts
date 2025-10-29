import { createSelector } from '@base-ui-components/utils/store';
import { EventCalendarState as State } from '../use-event-calendar';
import { SchedulerValidDate } from '../models';

export const eventCalendarOccurrencePlaceholderSelectors = {
  placeholderInDayCell: createSelector(
    (state: State, day: SchedulerValidDate, rowStart: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'day-grid' ||
        state.occurrencePlaceholder.isHidden
      ) {
        return null;
      }

      if (state.adapter.isSameDay(day, state.occurrencePlaceholder.start)) {
        return state.occurrencePlaceholder;
      }

      if (
        state.adapter.isSameDay(day, rowStart) &&
        state.adapter.isWithinRange(rowStart, [
          state.occurrencePlaceholder.start,
          state.occurrencePlaceholder.end,
        ])
      ) {
        return state.occurrencePlaceholder;
      }

      return null;
    },
  ),
  placeholderInTimeRange: createSelector(
    (state: State, start: SchedulerValidDate, end: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'time-grid' ||
        state.occurrencePlaceholder.isHidden
      ) {
        return null;
      }

      if (
        state.adapter.isBefore(state.occurrencePlaceholder.end, start) ||
        state.adapter.isAfter(state.occurrencePlaceholder.start, end)
      ) {
        return null;
      }

      return state.occurrencePlaceholder;
    },
  ),
  isCreatingInDayCell: createSelector((state: State, day: SchedulerValidDate) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.surfaceType !== 'day-grid' || placeholder.type !== 'creation') {
      return false;
    }
    return state.adapter.isSameDay(day, placeholder.start);
  }),
  isCreatingInTimeRange: createSelector(
    (state: State, dayStart: SchedulerValidDate, dayEnd: SchedulerValidDate) => {
      const placeholder = state.occurrencePlaceholder;
      if (placeholder?.surfaceType !== 'time-grid' || placeholder.type !== 'creation') {
        return false;
      }

      if (!state.adapter.isSameDay(placeholder.start, dayStart)) {
        return false;
      }

      const startsBeforeEnd = state.adapter.isBefore(placeholder.start, dayEnd);
      const endsAfterStart = state.adapter.isAfter(placeholder.end, dayStart);

      return startsBeforeEnd && endsAfterStart;
    },
  ),
};
