import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { CalendarEvent, CalendarEventId, CalendarResource, CalendarResourceId } from '../../models';
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

const isEventReadOnlySelector = createSelector(
  eventSelector,
  (event, _eventId: CalendarEventId) => {
    // TODO: Support putting the whole calendar as readOnly.
    return !!event?.readOnly;
  },
);

export const resourceSelectors = {
  allResources: createSelector((state: State) => state.resources),
  model: resourceSelector,
  visibleMap: createSelector((state: State) => state.visibleResources),
  visibleList: createSelectorMemoized(
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
};

export const eventSelectors = {
  allEvents: createSelector((state: State) => state.events),
  model: eventSelector,
  color: createSelector((state: State, eventId: CalendarEventId) => {
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
  isReadOnly: isEventReadOnlySelector,
  isDraggable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsDraggable,
    (isEventReadOnly, areEventsDraggable, _eventId: CalendarEventId) =>
      !isEventReadOnly && areEventsDraggable,
  ),
  isResizable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable, _eventId: CalendarEventId) =>
      !isEventReadOnly && areEventsResizable,
  ),
};

export const occurrencePlaceholderSelectors = {
  value: createSelector((state: State) => state.occurrencePlaceholder),
  isDefined: createSelector((state: State) => state.occurrencePlaceholder !== null),
  isMatching: createSelector(
    (state: State, occurrenceKey: string) =>
      state.occurrencePlaceholder?.occurrenceKey === occurrenceKey,
  ),
};

export const otherSelectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  ampm: createSelector((state: State) => state.ampm),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
};
