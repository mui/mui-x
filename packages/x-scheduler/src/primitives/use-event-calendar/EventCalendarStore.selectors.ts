import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { EventCalendarState as State } from './EventCalendarStore.types';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  preferences: createSelector((state: State) => state.preferences),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
};
