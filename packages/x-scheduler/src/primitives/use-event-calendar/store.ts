import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarView,
  CalendarPreferences,
  CalendarEventOccurrence,
  CalendarEventOccurrenceWithPosition,
  CalendarViewConfig,
  CalendarPreferencesMenuConfig,
  CalendarEventColor,
} from '../models';
import { Adapter } from '../utils/adapter/types';
import { getEventDays, getEventRowIndex } from '../utils/event-utils';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurrence-utils';

export type State = {
  /**
   * The adapter of the date library.
   * Not publicly exposed, is only set in state to avoid passing it to the selectors.
   */
  adapter: Adapter;
  /**
   * The date used to determine the visible date range in each view.
   */
  visibleDate: SchedulerValidDate;
  /**
   * The view displayed in the calendar.
   */
  view: CalendarView;
  /**
   * The views available in the calendar.
   */
  views: CalendarView[];
  /**
   * The events available in the calendar.
   */
  events: CalendarEvent[];
  /**
   * The resources the events can be assigned to.
   */
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
  /**
   * The color palette used for all events.
   */
  eventColor: CalendarEventColor;
  /**
   * Whether the component should display the current time indicator.
   */
  showCurrentTimeIndicator: boolean;
  /**
   * Preferences for the calendar.
   */
  preferences: CalendarPreferences;
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   */
  preferencesMenuConfig: CalendarPreferencesMenuConfig | false;
  /**
   * Config of the current view.
   * Should not be used in selectors, only in event handlers.
   */
  viewConfig: CalendarViewConfig | null;
};

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
  return !!event.readOnly || !!event.rrule;
});

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  ampm: createSelector((state: State) => state.ampm),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  preferences: createSelector((state: State) => state.preferences),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  resources: createSelector((state: State) => state.resources),
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
  eventsToRenderGroupedByDay: createSelector(
    (state: State) => state.events,
    (state: State) => state.visibleResources,
    (state: State) => state.adapter,
    (
      _state: State,
      parameters: { days: SchedulerValidDate[]; shouldOnlyRenderEventInOneCell: boolean },
    ) => parameters,
    (events, visibleResources, adapter, { days, shouldOnlyRenderEventInOneCell }) => {
      const daysMap = new Map<
        string,
        { events: CalendarEventOccurrence[]; allDayEvents: CalendarEventOccurrenceWithPosition[] }
      >();
      for (const day of days) {
        const dayKey = adapter.format(day, 'keyboardDate');
        daysMap.set(dayKey, { events: [], allDayEvents: [] });
      }

      // Collect ALL event occurrences (both recurring and non-recurring)
      const visibleOccurrences: CalendarEventOccurrence[] = [];

      for (const event of events) {
        // STEP 1: Skip events from resources that are not visible
        if (event.resource && visibleResources.get(event.resource) === false) {
          continue;
        }

        // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
        if (event.rrule) {
          const occurrences = getRecurringEventOccurrencesForVisibleDays(event, days, adapter);
          visibleOccurrences.push(...occurrences);
          continue;
        }

        // STEP 2-B: Non-recurring event processing, check if the event is within the visible days
        const eventFirstDay = adapter.startOfDay(event.start);
        const eventLastDay = adapter.endOfDay(event.end);
        if (
          adapter.isAfter(eventFirstDay, days[days.length - 1]) ||
          adapter.isBefore(eventLastDay, days[0])
        ) {
          continue; // Skip events that are not in the visible days
        }

        visibleOccurrences.push({ ...event, key: String(event.id) });
      }

      // STEP 3: Sort by the actual start date of each occurrence
      // We sort here so that events are processed in the correct order, ensuring consistent row index assignment for all-day events
      const sortedOccurrences = visibleOccurrences
        // TODO: Avoid JS Date conversion
        .map((occurrence) => ({
          occurrence,
          timestamp: adapter.toJsDate(occurrence.start).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((item) => item.occurrence);

      // STEP 4: Add the occurrence to the days map
      for (const occurrence of sortedOccurrences) {
        const eventDays: SchedulerValidDate[] = getEventDays(
          occurrence,
          days,
          adapter,
          shouldOnlyRenderEventInOneCell,
        );

        for (const day of eventDays) {
          const dayKey = adapter.format(day, 'keyboardDate');
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, { events: [], allDayEvents: [] });
          }

          // STEP 4.1: Process all-day events and get their position in the row
          if (occurrence.allDay) {
            const eventRowIndex = getEventRowIndex(occurrence, day, days, daysMap, adapter);

            daysMap.get(dayKey)!.allDayEvents.push({
              ...occurrence,
              eventRowIndex,
            });
          } else {
            daysMap.get(dayKey)!.events.push(occurrence);
          }
        }
      }

      return days.map((day) => {
        const dayKey = adapter.format(day, 'keyboardDate');
        return {
          day,
          events: daysMap.get(dayKey)?.events || [],
          allDayEvents: daysMap.get(dayKey)?.allDayEvents || [],
        };
      });
    },
  ),
  event: eventSelector,
  isEventReadOnly: isEventReadOnlySelector,
  isEventDraggable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsDraggable,
    (isEventReadOnly, areEventsDraggable) => !isEventReadOnly && areEventsDraggable,
  ),
  isEventResizable: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.areEventsResizable,
    (isEventReadOnly, areEventsResizable) => !isEventReadOnly && areEventsResizable,
  ),
};
