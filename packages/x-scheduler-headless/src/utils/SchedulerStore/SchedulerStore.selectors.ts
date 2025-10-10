import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  RecurrencePresetKey,
  RRuleSpec,
  SchedulerValidDate,
} from '../../models';
import { SchedulerState as State } from './SchedulerStore.types';
import { getByDayMaps } from '../recurrence-utils';

const eventSelector = createSelector(
  (state: State) => state.processedEventLookup,
  (processedEventLookup, eventId: CalendarEventId | null | undefined) =>
    eventId == null ? null : processedEventLookup.get(eventId),
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

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  nowUpdatedEveryMinute: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isMultiDayEvent: createSelector((state: State) => state.isMultiDayEvent),
  resources: createSelector((state: State) => state.resources),
  processedEventList: createSelectorMemoized(
    (state: State) => state.eventIdList,
    (state: State) => state.processedEventLookup,
    (eventIds, processedEventLookup) => eventIds.map((id) => processedEventLookup.get(id)!),
  ),
  eventIdList: createSelector((state: State) => state.eventIdList),
  eventModelList: createSelector((state: State) => state.eventModelList),
  eventModelLookup: createSelector((state: State) => state.eventModelLookup),
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
  occurrencePlaceholder: createSelector((state: State) => state.occurrencePlaceholder),
  hasOccurrencePlaceholder: createSelector((state: State) => state.occurrencePlaceholder !== null),
  isOccurrenceMatchingThePlaceholder: createSelector((state: State, occurrenceKey: string) => {
    const placeholder = state.occurrencePlaceholder;
    if (placeholder?.type !== 'internal-drag-or-resize') {
      return false;
    }

    return placeholder.occurrenceKey === occurrenceKey;
  }),
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
  isCurrentDay: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, date: SchedulerValidDate) => adapter.isSameDay(date, now),
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
