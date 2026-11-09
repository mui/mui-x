import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
import { DEFAULT_EVENT_CALENDAR_PREFERENCES } from '../use-event-calendar/EventCalendarStore';
import { schedulerPreferenceSelectors } from '../scheduler-selectors/schedulerPreferenceSelectors';

const allPreferencesSelector = createSelectorMemoized(
  (state: State) => state.preferences,
  (preferences) => ({
    ...DEFAULT_EVENT_CALENDAR_PREFERENCES,
    ...preferences,
  }),
);

const NO_WEEKDAYS: readonly number[] = [];

export const eventCalendarPreferenceSelectors = {
  all: allPreferencesSelector,
  menuConfig: (state: State) => state.preferencesMenuConfig,
  ampm: schedulerPreferenceSelectors.ampm,
  showWeekends: (state: State) => allPreferencesSelector(state).showWeekends,
  showWeekNumber: (state: State) => allPreferencesSelector(state).showWeekNumber,
  showEmptyDaysInAgenda: (state: State) => allPreferencesSelector(state).showEmptyDaysInAgenda,
  isSidePanelOpen: (state: State) => allPreferencesSelector(state).isSidePanelOpen,
  weekInfo: schedulerPreferenceSelectors.weekInfo,
  weekStartsOn: schedulerPreferenceSelectors.weekStartsOn,
  weekend: schedulerPreferenceSelectors.weekend,
  /**
   * The ISO weekdays the views leave out: the weekend of the locale of the dates when the
   * `showWeekends` preference is off.
   */
  hiddenWeekdays: (state: State) =>
    allPreferencesSelector(state).showWeekends
      ? NO_WEEKDAYS
      : schedulerPreferenceSelectors.weekend(state),
};
