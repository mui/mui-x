import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  RecurrencePresetKey,
  RRuleSpec,
  SchedulerValidDate,
} from '../../models';
import { SchedulerState as State } from './SchedulerStore.types';
import { getByDayMaps } from '../recurrence-utils';

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

export const nowSelectors = {
  value: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isCurrentDay: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, date: SchedulerValidDate) => adapter.isSameDay(date, now),
  ),
};

export const eventSelectors = {
  collection: createSelector((state: State) => state.events),
  model: eventSelector,
  isReadOnly: isEventReadOnlySelector,
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
};

export const resourceSelectors = {
  model: resourceSelector,
  collection: createSelector((state: State) => state.resources),
  visibleResourcesMap: createSelector((state: State) => state.visibleResources),
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
};

export const occurrencePlaceholderSelectors = {
  value: createSelector((state: State) => state.occurrencePlaceholder),
  isDefined: createSelector((state: State) => state.occurrencePlaceholder !== null),
  isMatching: createSelector((state: State, occurrenceKey: string) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.type !== 'internal-drag-or-resize') {
      return false;
    }

    return placeholder.occurrenceKey === occurrenceKey;
  }),
};

export const selectors = {
  // TODO: Remove those selectors in favor of using the `nowSelectors`, `eventSelectors`, `resourceSelectors` or `occurrencePlaceholderSelectors` directly.
  nowUpdatedEveryMinute: nowSelectors.value,
  isCurrentDay: nowSelectors.isCurrentDay,
  eventColor: eventSelectors.color,
  isEventReadOnly: isEventReadOnlySelector,
  event: eventSelector,
  events: eventSelectors.collection,
  resource: resourceSelector,
  resources: resourceSelectors.collection,
  visibleResourcesMap: resourceSelectors.visibleResourcesMap,
  visibleResourcesList: resourceSelectors.visibleResourcesList,
  occurrencePlaceholder: occurrencePlaceholderSelectors.value,
  hasOccurrencePlaceholder: occurrencePlaceholderSelectors.isDefined,
  isOccurrenceMatchingThePlaceholder: occurrencePlaceholderSelectors.isMatching,

  visibleDate: createSelector((state: State) => state.visibleDate),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  isMultiDayEvent: createSelector((state: State) => state.isMultiDayEvent),

  // TODO: Pass the occurrence key instead of the start and end dates once the occurrences are stored in the state.
  isOccurrenceStartedOrEnded: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, start: SchedulerValidDate, end: SchedulerValidDate) => {
      return {
        started: adapter.isBefore(start, now) || adapter.isEqual(start, now),
        ended: adapter.isBefore(end, now),
      };
    },
  ),
  recurrencePresets: createSelectorMemoized(
    (state: State) => state.adapter,
    (adapter, date: SchedulerValidDate): Record<RecurrencePresetKey, RRuleSpec> => {
      const { numToByDay: numToCode } = getByDayMaps(adapter);
      const dateDowCode = numToCode[adapter.getDayOfWeek(date)];
      const dateDayOfMonth = adapter.getDate(date);

      return {
        daily: {
          freq: 'DAILY',
          interval: 1,
        },
        weekly: {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [dateDowCode],
        },
        monthly: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [dateDayOfMonth],
        },
        yearly: {
          freq: 'YEARLY',
          interval: 1,
        },
      };
    },
  ),
};
