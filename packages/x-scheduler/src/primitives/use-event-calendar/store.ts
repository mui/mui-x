import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarView,
} from '../models';
import { Adapter } from '../utils/adapter/types';

export type State = {
  /**
   * The adapter of the date library.
   * Not publicly exposed, is only set in state to avoid passing it to the selectors.
   */
  adapter: Adapter;
  visibleDate: SchedulerValidDate;
  view: CalendarView;
  views: CalendarView[];
  events: CalendarEvent[];
  resources: CalendarResource[];
  /**
   * Visibility status for each resource.
   * A resource is visible if it is registered in this lookup with `true` value or if it is not registered at all.
   */
  visibleResources: Map<CalendarResourceId, boolean>;
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   */
  areEventsDraggable: boolean;
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   */
  areEventsResizable: boolean;
  /**
   * Whether the component should display the time in 12-hour format with AM/PM meridiem.
   */
  ampm: boolean;
};

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  ampm: createSelector((state: State) => state.ampm),
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  resources: createSelector((state: State) => state.resources),
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
  resourcesByIdMap: createSelectorMemoized(
    (state: State) => state.resources,
    (resources) => {
      const map = new Map<CalendarResourceId | undefined, CalendarResource>();
      for (const resource of resources) {
        map.set(resource.id, resource);
      }
      return map;
    },
  ),
  getEventsStartingInDay: createSelectorMemoized(
    (state: State) => state.adapter,
    (state: State) => state.events,
    (state: State) => state.visibleResources,
    (adapter, events, visibleResources) => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        if (event.resource && visibleResources.get(event.resource) === false) {
          continue; // Skip events for hidden resources
        }

        const dayKey = adapter.format(event.start, 'keyboardDate');
        if (!map.has(dayKey)) {
          map.set(dayKey, []);
        }
        map.get(dayKey)!.push(event);
      }

      return (day: SchedulerValidDate) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        return map.get(dayKey) || [];
      };
    },
  ),
  // TODO: Add a new data structure (Map?) to avoid linear complexity here.
  getEventById: createSelector((state: State, eventId: CalendarEventId | null) =>
    state.events.find((event) => event.id === eventId),
  ),
  isEventDraggable: createSelector((state: State, { readOnly }: { readOnly?: boolean }) => {
    return !readOnly && state.areEventsDraggable;
  }),
  isEventResizable: createSelector((state: State, { readOnly }: { readOnly?: boolean }) => {
    return !readOnly && state.areEventsResizable;
  }),
};
