import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import { EventCalendarState as State } from '../use-event-calendar';
import { DEFAULT_EVENT_CALENDAR_PREFERENCES } from '../use-event-calendar/EventCalendarStore';

const allPreferencesSelector = createSelectorMemoized(
  (state: State) => state.preferences,
  (preferences) => ({
    ...DEFAULT_EVENT_CALENDAR_PREFERENCES,
    ...preferences,
  }),
);

export const eventCalendarPreferenceSelectors = {
  all: allPreferencesSelector,
  menuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  ampm: createSelector(allPreferencesSelector, (preferences) => preferences.ampm),
  showWeekends: createSelector(allPreferencesSelector, (preferences) => preferences.showWeekends),
  showWeekNumber: createSelector(
    allPreferencesSelector,
    (preferences) => preferences.showWeekNumber,
  ),
  showEmptyDaysInAgenda: createSelector(
    allPreferencesSelector,
    (preferences) => preferences.showEmptyDaysInAgenda,
  ),
  isSidePanelOpen: createSelector(
    allPreferencesSelector,
    (preferences) => preferences.isSidePanelOpen,
  ),
};
