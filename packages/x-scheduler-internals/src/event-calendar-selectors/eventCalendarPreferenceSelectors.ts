import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
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
  menuConfig: (state: State) => state.preferencesMenuConfig,
  ampm: (state: State) => allPreferencesSelector(state).ampm,
  showWeekends: (state: State) => allPreferencesSelector(state).showWeekends,
  showWeekNumber: (state: State) => allPreferencesSelector(state).showWeekNumber,
  showEmptyDaysInAgenda: (state: State) => allPreferencesSelector(state).showEmptyDaysInAgenda,
  isSidePanelOpen: (state: State) => allPreferencesSelector(state).isSidePanelOpen,
  weekStartsOn: (state: State) => allPreferencesSelector(state).weekStartsOn,
};
