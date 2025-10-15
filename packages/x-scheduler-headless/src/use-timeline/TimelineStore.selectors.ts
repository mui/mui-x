import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { TimelineState as State } from './TimelineStore.types';
import { CalendarEventId } from '../models';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  ampm: createSelector((state: State) => state.preferences.ampm),
  isEventDraggable: createSelector(
    schedulerSelectors.isEventReadOnly,
    (state: State) => state.areEventsDraggable,
    (state: State) => state.view,
    (isEventReadOnly, areEventsDraggable, _eventId: CalendarEventId) => {
      if (isEventReadOnly || !areEventsDraggable) {
        return false;
      }

      return true;
    },
  ),
  isEventResizable: createSelector(
    schedulerSelectors.isEventReadOnly,
    (state: State) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable, _eventId: CalendarEventId) => {
      if (isEventReadOnly || !areEventsResizable) {
        return false;
      }

      return true;
    },
  ),
};
