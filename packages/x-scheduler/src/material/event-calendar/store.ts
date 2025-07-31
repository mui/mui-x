import { createSelector, createSelectorMemoized, Store } from '@base-ui-components/utils/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';
import { SchedulerValidDate } from '../../primitives/models';
import { CalendarEvent, CalendarEventId } from '../models/events';
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
      const daysMap = new Map<string, { rowStartsAt: number; events: CalendarEvent[] }>();
      for (const day of days) {
        const dayKey = adapter.format(day, 'keyboardDate');
        daysMap.set(dayKey, { rowStartsAt: 1, events: [] });
      }
      for (const event of events) {
        if (event.resource && visibleResources.get(event.resource) === false) {
          continue; // Skip events for hidden resources
        }
        let rowStartsAt = 1;

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
          eventDays = days.filter(
            (day) =>
              adapter.isSameDay(day, eventFirstDay) ||
              adapter.isSameDay(day, eventLastDay) ||
              (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay)),
          );
        }

        for (const day of eventDays) {
          const dayKey = adapter.format(day, 'keyboardDate');
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, { rowStartsAt: 1, events: [] });
          }

          const isFirstEvent = !daysMap.get(dayKey)!.events.length;
          if (isFirstEvent && adapter.isBefore(eventFirstDay, day)) {
            const eventFirstDayKey = adapter.format(eventFirstDay, 'keyboardDate');
            const eventStartPositionInArray =
              daysMap
                .get(eventFirstDayKey)
                ?.events?.findIndex((eventInMap) => eventInMap.id === event.id) || 0;
            rowStartsAt = eventStartPositionInArray + 1;
          } else {
            rowStartsAt = 1;
          }

          daysMap.get(dayKey)!.rowStartsAt = Math.max(
            rowStartsAt,
            daysMap.get(dayKey)!.rowStartsAt,
          );
          daysMap.get(dayKey)!.events.push(event);
        }
      }

      return days.map((day) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        return {
          day,
          rowStartsAt: daysMap.get(dayKey)?.rowStartsAt || 1,
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
