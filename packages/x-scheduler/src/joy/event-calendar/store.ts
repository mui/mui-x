import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { createSelector, createSelectorMemoized, Store } from '../../base-ui-copy/utils/store';
import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent } from '../models/events';
import { CalendarResource, CalendarResourceId } from '../models/resource';
import { EventCalendarView } from './EventCalendar.types';

const adapter = getAdapter();

export type State = {
  visibleDate: SchedulerValidDate;
  view: EventCalendarView;
  views: EventCalendarView[];
  events: CalendarEvent[];
  resources: CalendarResource[];
  /**
   * Visibility status for each resource.
   * A resource is visible if it is registered in this lookup with `true` value or if it is not registered at all.
   */
  visibleResources: Map<CalendarResourceId, boolean>;
};

export type EventCalendarStore = Store<State>;

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
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
    (state: State) => state.events,
    (state: State) => state.visibleResources,
    (events, visibleResources) => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        if (event.allDay) {
          continue; // Only consider all-day events
        }
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
  getAllDayEventsStartingInDay: createSelectorMemoized(
    (state: State) => state.events,
    (state: State) => state.visibleResources,
    (events, visibleResources) => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        if (!event.allDay) {
          continue; // Only consider all-day events
        }
        if (event.resource && visibleResources.get(event.resource) === false) {
          continue; // Skip events for hidden resources
        }

        const dayKey = adapter.format(event.start, 'keyboardDate');
        if (!map.has(dayKey)) {
          map.set(dayKey, []);
        }
        map.get(dayKey)!.push(event);
      }

      return (day: SchedulerValidDate, startDateOfView: SchedulerValidDate) => {
        const dayKey = adapter.format(day, 'keyboardDate');

        if (adapter.isSameDay(day, startDateOfView)) {
          const newEvents = events.filter(
            (event) =>
              event.allDay &&
              (!event.resource || !visibleResources.get(event.resource)) &&
              adapter.startOfDay(event.start) <= adapter.startOfDay(day) &&
              adapter.startOfDay(event.end) >= adapter.startOfDay(day),
          );
          return newEvents;
        }

        return map.get(dayKey) || [];
      };
    },
  ),
};
