import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { EventCalendarState as State } from './EventCalendarStore.types';
import { SchedulerValidDate } from '../models';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  preferences: createSelector((state: State) => state.preferences),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  isDayView: createSelector((state: State) => state.view === 'day'),
  occurrencePlaceholderToRenderInDayCell: createSelector(
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
  occurrencePlaceholderToRenderInTimeRange: createSelector(
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
