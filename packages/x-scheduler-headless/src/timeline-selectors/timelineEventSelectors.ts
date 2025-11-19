import { createSelector } from '@base-ui-components/utils/store';
import { TimelineState as State } from '../use-timeline';
import { schedulerEventSelectors } from '../scheduler-selectors';
import { SchedulerEventId } from '../models';

export const timelineEventSelectors = {
  isDraggable: createSelector(
    schedulerEventSelectors.isReadOnly,
    (state: State) => state.areEventsDraggable,
    (state: State) => state.view,
    (isEventReadOnly, areEventsDraggable, _eventId: SchedulerEventId) => {
      if (isEventReadOnly || !areEventsDraggable) {
        return false;
      }

      return true;
    },
  ),
  isResizable: createSelector(
    schedulerEventSelectors.isReadOnly,
    (state: State) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable, _eventId: SchedulerEventId) => {
      if (isEventReadOnly || !areEventsResizable) {
        return false;
      }

      return true;
    },
  ),
};
