import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../scheduler-selectors';
import { TimelineState as State } from '../use-timeline';
import { CalendarEventId } from '../models';

export const timelineEventSelectors = {
  isDraggable: createSelector(
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
  isResizable: createSelector(
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
