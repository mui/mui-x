import { createSelector, createSelectorMemoized, Store } from '@base-ui-components/utils/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent, CalendarEventId, CalendarEventWithPosition } from '../models/events';
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

export type EventCalendarStore = Store<State>;

const isDayWithinRange = (
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
) => {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
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
  eventsToRenderGroupedByDay: createSelector(
    (state: State) => state.events,
    (state: State) => state.visibleResources,
    (
      _state: State,
      parameters: { days: SchedulerValidDate[]; shouldOnlyRenderEventInOneCell: boolean },
    ) => parameters,
    (events, visibleResources, { days, shouldOnlyRenderEventInOneCell }) => {
      const daysMap = new Map<string, { events: CalendarEventWithPosition[] }>();
      for (const day of days) {
        const dayKey = adapter.format(day, 'keyboardDate');
        daysMap.set(dayKey, { events: [] });
      }
      for (const event of events) {
        if (event.resource && visibleResources.get(event.resource) === false) {
          continue; // Skip events for hidden resources
        }

        const eventFirstDay = adapter.startOfDay(event.start);
        const eventLastDay = adapter.endOfDay(event.end);
        if (
          adapter.isAfter(eventFirstDay, days[days.length - 1]) ||
          adapter.isBefore(eventLastDay, days[0])
        ) {
          continue; // Skip events that are not in the visible days
        }

        let eventDays: SchedulerValidDate[];
        if (shouldOnlyRenderEventInOneCell) {
          if (adapter.isBefore(eventFirstDay, days[0])) {
            eventDays = [days[0]];
          } else {
            eventDays = [eventFirstDay];
          }
        } else {
          eventDays = days.filter((day) => isDayWithinRange(day, eventFirstDay, eventLastDay));
        }

        for (const day of eventDays) {
          const dayKey = adapter.format(day, 'keyboardDate');
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, { events: [] });
          }

          const eventIndex = daysMap.get(dayKey)!.events.length;
          let eventRowIndex;
          // If the event starts before the current day, we need to find the row index of the first day of the event
          if (adapter.isBefore(eventFirstDay, day)) {
            const eventFirstDayKey = adapter.format(eventFirstDay, 'keyboardDate');
            const eventStartPositionInArray =
              daysMap
                .get(eventFirstDayKey)
                ?.events?.find((eventInMap) => eventInMap.id === event.id)?.eventRowIndex || 1;
            eventRowIndex = eventStartPositionInArray;
            // Otherwise, we just render the event on the row after the previous events rendered in the same column
          } else {
            // we need to know the row index of the previous events rendered in a column
            const previousEventIndex =
              daysMap.get(dayKey)!.events[eventIndex - 1]?.eventRowIndex || 0;
            eventRowIndex = previousEventIndex + 1;
          }

          daysMap.get(dayKey)!.events.push({
            ...event,
            eventRowIndex,
          });
        }
      }

      return days.map((day) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        return {
          day,
          events: daysMap.get(dayKey)?.events || [],
        };
      });
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
