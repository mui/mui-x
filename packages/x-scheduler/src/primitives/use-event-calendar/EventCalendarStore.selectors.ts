import { createSelector } from '@base-ui-components/utils/store';
import { EventCalendarState as State } from './EventCalendarStore.types';
import { SchedulerValidDate } from '../models';

export const viewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  isDayView: createSelector((state: State) => state.view === 'day'),
};

export const preferencesSelectors = {
  preferences: createSelector((state: State) => state.preferences),
  showWeekends: createSelector((state: State) => state.preferences.showWeekends),
  showWeekNumber: createSelector((state: State) => state.preferences.showWeekNumber),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
};

export const occurrencePlaceholderInViewSelectors = {
  inDayCell: createSelector(
    (state: State, day: SchedulerValidDate, rowStart: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'day-grid'
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
  inTimeColumn: createSelector(
    (state: State, start: SchedulerValidDate, end: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'time-grid'
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
};
