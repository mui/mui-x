import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { EventCalendarState } from './EventCalendarStore.types';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: EventCalendarState) => state.view),
  views: createSelector((state: EventCalendarState) => state.views),
  preferences: createSelector((state: EventCalendarState) => state.preferences),
  preferencesMenuConfig: createSelector((state: EventCalendarState) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: EventCalendarState) => state.views.includes('day')),
};
