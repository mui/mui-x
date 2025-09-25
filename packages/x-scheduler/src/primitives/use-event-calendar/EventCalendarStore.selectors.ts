import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { EventCalendarState as State } from './EventCalendarStore.types';
import { CalendarEventId, SchedulerValidDate, EventSurfaceType } from '../models';
import { isMultiDayEvent } from '../utils/event-utils';

export const selectors = {
  ...schedulerSelectors,
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  preferences: createSelector((state: State) => state.preferences),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  isEventDraggable: createSelector(
    schedulerSelectors.isEventReadOnly,
    (state: State) => state.areEventsDraggable,
    (state: State) => state.view,
    (
      isEventReadOnly,
      areEventsDraggable,
      view,
      _eventId: CalendarEventId,
      surfaceType: EventSurfaceType,
    ) => {
      if (isEventReadOnly || !areEventsDraggable) {
        return false;
      }

      // There is only one day cell in the day view
      if (surfaceType === 'day-grid' && view === 'day') {
        return false;
      }

      return true;
    },
  ),
  isEventResizable: createSelector(
    schedulerSelectors.isEventReadOnly,
    schedulerSelectors.event,
    (state: State) => state.areEventsResizable,
    (state: State) => state.view,
    (
      isEventReadOnly,
      event,
      areEventsResizable,
      view,
      _eventId: CalendarEventId,
      surfaceType: EventSurfaceType,
    ) => {
      if (isEventReadOnly || !areEventsResizable) {
        return false;
      }

      // There is only one day cell in the day view
      if (view === 'day' && surfaceType === 'day-grid') {
        return false;
      }

      // In month view, only multi-day events can be resized
      if (view === 'month' && surfaceType === 'day-grid' && !isMultiDayEvent(event!)) {
        return false;
      }

      return true;
    },
  ),
  occurrencePlaceholderToRenderInDayCell: createSelector(
    (state: State, day: SchedulerValidDate, rowStart: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'day-grid'
      ) {
        return null;
      }

      if (state.adapter.isSameDay(day, state.occurrencePlaceholder.start)) {
        return state.occurrencePlaceholder;
      }

      if (
        state.adapter.isSameDay(day, rowStart) &&
        state.adapter.isWithinRange(rowStart, [
          state.occurrencePlaceholder.start,
          state.occurrencePlaceholder.end,
        ])
      ) {
        return state.occurrencePlaceholder;
      }

      return null;
    },
  ),
  occurrencePlaceholderToRenderInTimeRange: createSelector(
    (state: State, start: SchedulerValidDate, end: SchedulerValidDate) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'time-grid'
      ) {
        return null;
      }
      if (
        state.adapter.isBefore(state.occurrencePlaceholder.end, start) ||
        state.adapter.isAfter(state.occurrencePlaceholder.start, end)
      ) {
        return null;
      }

      return state.occurrencePlaceholder;
    },
  ),
};
