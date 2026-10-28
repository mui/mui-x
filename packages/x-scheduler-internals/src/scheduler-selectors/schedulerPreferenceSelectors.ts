import { createSelectorMemoized } from '@base-ui/utils/store';
import type { SchedulerState as State } from '../internals/utils/SchedulerStore/SchedulerStore.types';
import { DEFAULT_SCHEDULER_PREFERENCES } from '../internals/utils/SchedulerStore';
import { getLocaleAmpm, getLocaleWeekInfo } from '../internals/utils/date-locale';
import type { WeekInfo } from '../internals/utils/date-locale';

const allSchedulerPreferencesSelector = createSelectorMemoized(
  (state: State) => state.preferences,
  (preferences) => ({
    ...DEFAULT_SCHEDULER_PREFERENCES,
    ...preferences,
  }),
);

const weekInfoSelector = createSelectorMemoized(
  (state: State) => allSchedulerPreferencesSelector(state).weekStartsOn,
  (state: State) => state.dateLocale,
  (weekStartsOn, dateLocale): WeekInfo => {
    const localeWeekInfo = getLocaleWeekInfo(dateLocale);
    return weekStartsOn === undefined
      ? localeWeekInfo
      : { ...localeWeekInfo, firstDay: weekStartsOn };
  },
);

export const schedulerPreferenceSelectors = {
  all: allSchedulerPreferencesSelector,
  /**
   * Whether the times are on a 12-hour clock: the `ampm` preference, or the hour cycle of the locale
   * of the dates.
   */
  ampm: (state: State) =>
    allSchedulerPreferencesSelector(state).ampm ?? getLocaleAmpm(state.dateLocale),
  /**
   * The weeks of the views: they start on the `weekStartsOn` preference, or on the first day of the
   * week of the locale of the dates, and the first week of a year follows that locale.
   */
  weekInfo: weekInfoSelector,
  weekStartsOn: (state: State) => weekInfoSelector(state).firstDay,
};
