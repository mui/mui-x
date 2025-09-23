import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  SchedulerValidDate,
} from '../../models';
import { SchedulerState as State } from './SchedulerStore.types';

const eventByIdMapSelector = createSelectorMemoized(
  (state: State) => state.events,
  (events) => {
    const map = new Map<CalendarEventId | null | undefined, CalendarEvent>();
    for (const event of events) {
      map.set(event.id, event);
    }
    return map;
  },
);

const eventSelector = createSelector(
  eventByIdMapSelector,
  (events, eventId: CalendarEventId | null | undefined) => events.get(eventId),
);

const resourcesByIdMapSelector = createSelectorMemoized(
  (state: State) => state.resources,
  (resources) => {
    const map = new Map<CalendarResourceId | null | undefined, CalendarResource>();
    for (const resource of resources) {
      map.set(resource.id, resource);
    }
    return map;
  },
);

const resourceSelector = createSelector(
  resourcesByIdMapSelector,
  (resourcesByIdMap, resourceId: string | null | undefined) => resourcesByIdMap.get(resourceId),
);

// We don't pass the eventId to be able to pass events with properties not stored in state for the drag and drop.
const isEventReadOnlySelector = createSelector((state: State, event: CalendarEvent) => {
  // TODO: Support putting the whole calendar as readOnly.
  return !!event.readOnly;
});

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  ampm: createSelector((state: State) => state.ampm),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  resources: createSelector((state: State) => state.resources),
  events: createSelector((state: State) => state.events),
  visibleResourcesMap: createSelector((state: State) => state.visibleResources),
  resource: resourceSelector,
  eventColor: createSelector((state: State, eventId: CalendarEventId) => {
    const event = eventSelector(state, eventId);
    if (!event) {
      return state.eventColor;
    }

    const resourceColor = resourceSelector(state, event.resource)?.eventColor;
    if (resourceColor) {
      return resourceColor;
    }

    return state.eventColor;
  }),
  visibleResourcesList: createSelectorMemoized(
    (state: State) => state.resources,
    (state: State) => state.visibleResources,
    (resources, visibleResources) =>
      resources
        .filter(
          (resource) =>
            !visibleResources.has(resource.id) || visibleResources.get(resource.id) === true,
        )
        .map((resource) => resource.id),
  ),
  event: eventSelector,
  isEventReadOnly: isEventReadOnlySelector,
  isEventDraggable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsDraggable,
    (isEventReadOnly, areEventsDraggable, _event: CalendarEvent) =>
      !isEventReadOnly && areEventsDraggable,
  ),
  isEventResizable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable, _event: CalendarEvent) =>
      !isEventReadOnly && areEventsResizable,
  ),
  occurrencePlaceholder: createSelector((state: State) => state.occurrencePlaceholder),
  hasOccurrencePlaceholder: createSelector((state: State) => state.occurrencePlaceholder !== null),
  isOccurrenceMatchingThePlaceholder: createSelector(
    (state: State, occurrenceKey: string) =>
      state.occurrencePlaceholder?.occurrenceKey === occurrenceKey,
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
