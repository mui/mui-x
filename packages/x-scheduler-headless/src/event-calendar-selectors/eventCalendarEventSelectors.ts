import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../scheduler-selectors';
import { EventCalendarState as State } from '../use-event-calendar';
import { CalendarEventId, EventSurfaceType } from '../models';

export const eventCalendarEventSelectors = {
  isDraggable: createSelector(
    schedulerSelectors.isEventReadOnly,
    (state: State) => state.areEventsDraggable,
    (state: State) => state.eventModelStructure,
    (isEventReadOnly, areEventsDraggable, eventModelStructure, _eventId: CalendarEventId) => {
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
    (state: State, eventId: CalendarEventId, surfaceType: EventSurfaceType) => {
      if (schedulerSelectors.isEventReadOnly(state, eventId) || !state.areEventsDraggable) {
        return false;
      }

      const event = schedulerSelectors.event(state, eventId);
      const { view, eventModelStructure, isMultiDayEvent } = state;

      // There is only one day cell in the day view
      if (view === 'day' && surfaceType === 'day-grid') {
        return false;
      }

      // In month view, only multi-day events can be resized
      if (view === 'month' && surfaceType === 'day-grid' && !isMultiDayEvent(event!)) {
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
