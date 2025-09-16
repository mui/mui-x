import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { CalendarEvent, CalendarEventId, CalendarResource, CalendarResourceId } from '../../models';
import { SchedulerState } from './SchedulerStore.types';

const eventByIdMapSelector = createSelectorMemoized(
  (state: SchedulerState) => state.events,
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
  (state: SchedulerState) => state.resources,
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
const isEventReadOnlySelector = createSelector((state: SchedulerState, event: CalendarEvent) => {
  // TODO: Support putting the whole calendar as readOnly.
  return !!event.readOnly;
});

export const selectors = {
  visibleDate: createSelector((state: SchedulerState) => state.visibleDate),
  ampm: createSelector((state: SchedulerState) => state.ampm),
  showCurrentTimeIndicator: createSelector(
    (state: SchedulerState) => state.showCurrentTimeIndicator,
  ),
  resources: createSelector((state: SchedulerState) => state.resources),
  events: createSelector((state: SchedulerState) => state.events),
  visibleResourcesMap: createSelector((state: SchedulerState) => state.visibleResources),
  resource: resourceSelector,
  eventColor: createSelector((state: SchedulerState, eventId: CalendarEventId) => {
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
    (state: SchedulerState) => state.resources,
    (state: SchedulerState) => state.visibleResources,
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
    (state: SchedulerState) => state.areEventsDraggable,
    (isEventReadOnly, areEventsDraggable, _event: CalendarEvent) =>
      !isEventReadOnly && areEventsDraggable,
  ),
  isEventResizable: createSelector(
    isEventReadOnlySelector,
    (state: SchedulerState) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable, _event: CalendarEvent) =>
      !isEventReadOnly && areEventsResizable,
  ),
};
