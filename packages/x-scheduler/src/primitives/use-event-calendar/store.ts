import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarView,
  CalendarEventWithPosition,
} from '../models';
import { Adapter } from '../utils/adapter/types';
import { getEventWithLargestRowIndexForDay } from '../utils/event-utils';

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

const isDayWithinRange = (
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
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
    (state: State) => state.adapter,
    (
      _state: State,
      parameters: { days: SchedulerValidDate[]; shouldOnlyRenderEventInOneCell: boolean },
    ) => parameters,
    (events, visibleResources, adapter, { days, shouldOnlyRenderEventInOneCell }) => {
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
          eventDays = days.filter((day) =>
            isDayWithinRange(day, eventFirstDay, eventLastDay, adapter),
          );
        }

        for (const day of eventDays) {
          const dayKey = adapter.format(day, 'keyboardDate');
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, { events: [] });
          }

          const eventIndex = daysMap.get(dayKey)!.events.length;
          let eventRowIndex;
          // If the event starts before the current day, we need to find the row index of the first day of the event
          if (adapter.isBefore(eventFirstDay, day) && !adapter.isSameDay(days[0], day)) {
            let eventFirstDayKey = adapter.format(eventFirstDay, 'keyboardDate');
            if (adapter.isBefore(eventFirstDay, days[0])) {
              eventFirstDayKey = adapter.format(days[0], 'keyboardDate');
            }
            const eventStartRowPosition =
              daysMap
                .get(eventFirstDayKey)
                ?.events?.find((eventInMap) => eventInMap.id === event.id)?.eventRowIndex || 1;
            eventRowIndex = eventStartRowPosition;
            // Otherwise, we just render the event on the first available row in the column
          } else {
            // we need to know the row index of the previous events rendered in a column
            const previousEventRowPosition = getEventWithLargestRowIndexForDay(dayKey, daysMap);

            if (previousEventRowPosition + 1 > eventIndex + 1) {
              for (let i = 1; i < previousEventRowPosition + 1; i += 1) {
                if (
                  daysMap
                    .get(dayKey)!
                    .events?.findIndex((eventInMap) => eventInMap.eventRowIndex === i) === -1
                ) {
                  eventRowIndex = i;
                  break;
                }
              }
            } else {
              eventRowIndex = previousEventRowPosition + 1;
            }
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
