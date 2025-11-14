import { createSelector } from '@base-ui-components/utils/store';
import { schedulerEventSelectors } from '../scheduler-selectors';
import { EventCalendarState as State } from '../use-event-calendar';
import { SchedulerEventId } from '../models';

export const eventCalendarEventSelectors = {
  isDraggable: createSelector(
    schedulerEventSelectors.isReadOnly,
    (state: State) => state.areEventsDraggable,
    (state: State) => state.eventModelStructure,
    (isEventReadOnly, areEventsDraggable, eventModelStructure, _eventId: SchedulerEventId) => {
      if (isEventReadOnly || !areEventsDraggable) {
        return false;
      }

      if (eventModelStructure?.start && !eventModelStructure?.start.setter) {
        return false;
      }

      if (eventModelStructure?.end && !eventModelStructure?.end.setter) {
        return false;
      }

      return true;
    },
  ),
  isResizable: createSelector(
    schedulerEventSelectors.isReadOnly,
    (state: State) => state.areEventsResizable,
    (state: State) => state.eventModelStructure,
    (isEventReadonly, areEventsResizable, eventModelStructure, _eventId: SchedulerEventId) => {
      if (isEventReadonly || !areEventsResizable) {
        return false;
      }

      // TODO: Allow to set the drag only for the start date or only for the end date and adapt the two next conditions.
      if (eventModelStructure?.start && !eventModelStructure?.start.setter) {
        return false;
      }

      if (eventModelStructure?.end && !eventModelStructure?.end.setter) {
        return false;
      }

      return true;
    },
  ),
};
