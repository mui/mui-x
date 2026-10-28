import { createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { DEFAULT_SCHEDULER_PREFERENCES } from '../internals/utils/SchedulerStore';
import { getLocaleWeekInfo } from '../internals/utils/date-locale';

const allSchedulerPreferencesSelector = createSelectorMemoized(
  (state: State) => state.preferences,
  (preferences) => ({
    ...DEFAULT_SCHEDULER_PREFERENCES,
    ...preferences,
  }),
);

export const schedulerPreferenceSelectors = {
  all: allSchedulerPreferencesSelector,
  ampm: (state: State) => allSchedulerPreferencesSelector(state).ampm,
  /**
   * The day the weeks start on: the `weekStartsOn` preference, or the first day of the week of the
   * locale of the dates.
   */
  weekStartsOn: (state: State) =>
    allSchedulerPreferencesSelector(state).weekStartsOn ??
    getLocaleWeekInfo(state.dateLocale).firstDay,
};
