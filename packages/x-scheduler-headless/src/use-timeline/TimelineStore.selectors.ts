import { createSelector } from '@base-ui-components/utils/store';
import { selectors as schedulerSelectors } from '../utils/SchedulerStore';
import { TimelineState as State } from './TimelineStore.types';
import { CalendarEventId, CalendarResourceId, SchedulerValidDate } from '../models';

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
  occurrencePlaceholderToRenderInTimeRange: createSelector(
    (
      state: State,
      start: SchedulerValidDate,
      end: SchedulerValidDate,
      resourceId: CalendarResourceId | undefined,
    ) => {
      if (
        state.occurrencePlaceholder === null ||
        state.occurrencePlaceholder.surfaceType !== 'timeline' ||
        state.occurrencePlaceholder.isHidden ||
        state.occurrencePlaceholder.resourceId !== resourceId
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
