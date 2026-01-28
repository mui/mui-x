import { createSelector } from '@base-ui/utils/store';
import { EventCalendarState as State } from '../use-event-calendar';

export const eventCalendarViewSelectors = {
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
};
