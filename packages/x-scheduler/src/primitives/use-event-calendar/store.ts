import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  CalendarView,
  CalendarPreferences,
  CalendarViewConfig,
  CalendarPreferencesMenuConfig,
  CalendarEventColor,
} from '../models';
import { Adapter } from '../utils/adapter/types';
import { CalendarEventModelStructure } from './useEventCalendar.types';

export type State<EventModel extends {} = any> = {
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
   * The IDs of the events available in the calendar.
   */
  eventIds: CalendarEventId[];
  /**
   * A lookup to get the event model as provided to props.events from its ID.
   */
  eventModelLookup: Map<CalendarEventId, EventModel>;
  /**
   * A lookup to get the processed event from its ID.
   */
  calendarEventLookup: Map<CalendarEventId, CalendarEvent>;
  /**
   * The structure of the event model.
   * It defines how to read and write the properties of the event model.
   * If not provided, the event model is assumed to match the `CalendarEvent` interface.
   */
  eventModelStructure: CalendarEventModelStructure<any>;
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

const eventSelector = createSelector((state: State, eventId: CalendarEventId | null | undefined) =>
  eventId == null ? null : state.calendarProcessedEventLookup.get(eventId),
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
  view: createSelector((state: State) => state.view),
  views: createSelector((state: State) => state.views),
  preferences: createSelector((state: State) => state.preferences),
  preferencesMenuConfig: createSelector((state: State) => state.preferencesMenuConfig),
  hasDayView: createSelector((state: State) => state.views.includes('day')),
  resources: createSelector((state: State) => state.resources),
  // events: createSelector((state: State) => state.events),
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
};
