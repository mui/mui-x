import { createSelector } from '@base-ui-components/utils/store';
import { EventCalendarState as State } from '../use-event-calendar';

export const eventCalendarPreferenceSelectors = {
  all: createSelector((state: State) => state.preferences),
  menuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  ampm: createSelector((state: State) => state.preferences.ampm),
  showWeekends: createSelector((state: State) => state.preferences.showWeekends),
  showWeekNumber: createSelector((state: State) => state.preferences.showWeekNumber),
  showEmptyDaysInAgenda: createSelector((state: State) => state.preferences.showEmptyDaysInAgenda),
  isSidePanelOpen: createSelector((state: State) => state.preferences.isSidePanelOpen),
};
