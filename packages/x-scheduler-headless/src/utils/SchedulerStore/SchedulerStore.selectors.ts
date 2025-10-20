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
  (state: State) => state.readOnly,
  (event, readOnly, _eventId: CalendarEventId) => {
    return !!event?.readOnly || readOnly;
  },
);

export const selectors = {
  visibleDate: createSelector((state: State) => state.visibleDate),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  nowUpdatedEveryMinute: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isMultiDayEvent: createSelector((state: State) => state.isMultiDayEvent),
  resources: createSelector((state: State) => state.resources),
  events: createSelector((state: State) => state.events),
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
  canDragEventsFromTheOutside: createSelector((state: State) => state.canDragEventsFromTheOutside),
  canDropEventsToTheOutside: createSelector((state: State) => state.canDropEventsToTheOutside),
  isCurrentDay: createSelector(
    (state: State) => state.adapter,
    (state: State) => state.nowUpdatedEveryMinute,
    (adapter, now, date: SchedulerValidDate) => adapter.isSameDay(date, now),
  ),
  /**
   * Builds the presets the user can choose from when creating or editing a recurring event.
   */
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
  /**
   * Determines which preset (if any) the given rule corresponds to.
   * If the rule does not correspond to any preset, 'custom' is returned.
   * If no rule is provided, null is returned.
   */
  defaultRecurrencePresetKey: createSelectorMemoized(
    (state: State) => state.adapter,
    (
      adapter,
      rule: CalendarEvent['rrule'] | undefined,
      occurrenceStart: SchedulerValidDate,
    ): RecurrencePresetKey | 'custom' | null => {
      if (!rule) {
        return null;
      }

      const interval = rule.interval ?? 1;
      const neverEnds = !rule.count && !rule.until;
      const hasSelectors = !!(
        rule.byDay?.length ||
        rule.byMonthDay?.length ||
        rule.byMonth?.length
      );
      const { numToByDay: numToCode } = getByDayMaps(adapter);

      switch (rule.freq) {
        case 'DAILY': {
          // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
          return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
        }

        case 'WEEKLY': {
          // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
          const startDowCode = numToCode[adapter.getDayOfWeek(occurrenceStart)];

          const byDay = rule.byDay ?? [];
          const matchesDefaultByDay =
            byDay.length === 0 || (byDay.length === 1 && byDay[0] === startDowCode);
          const isPresetWeekly =
            interval === 1 &&
            neverEnds &&
            matchesDefaultByDay &&
            !(rule.byMonthDay?.length || rule.byMonth?.length);

          return isPresetWeekly ? 'weekly' : 'custom';
        }

        case 'MONTHLY': {
          // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
          const day = adapter.getDate(occurrenceStart);
          const byMonthDay = rule.byMonthDay ?? [];
          const matchesDefaultByMonthDay =
            byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
          const isPresetMonthly =
            interval === 1 &&
            neverEnds &&
            matchesDefaultByMonthDay &&
            !(rule.byDay?.length || rule.byMonth?.length);

          return isPresetMonthly ? 'monthly' : 'custom';
        }

        case 'YEARLY': {
          // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
          return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
        }

        default:
          return 'custom';
      }
    },
  ),
};
