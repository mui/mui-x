import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
  SchedulerValidDate,
} from '../models';
import { SchedulerState as State } from '../utils/SchedulerStore/SchedulerStore.types';
import { getWeekDayCode } from '../utils/recurring-event-utils';

const eventSelector = createSelector(
  (state: State) => state.processedEventLookup,
  (processedEventLookup, eventId: CalendarEventId | null | undefined) =>
    eventId == null ? null : processedEventLookup.get(eventId),
);

const resourceSelector = createSelector(
  (state: State) => state.processedResourceLookup,
  (processedResourceLookup, resourceId: string | null | undefined) =>
    resourceId == null ? null : processedResourceLookup.get(resourceId),
);

const isEventReadOnlySelector = createSelector(
  eventSelector,
  (state: State) => state.readOnly,
  (event, readOnly, _eventId: CalendarEventId) => {
    return !!event?.readOnly || readOnly;
  },
);

export const selectors = {
  ampm: createSelector((state: State) => state.preferences.ampm),
  visibleDate: createSelector((state: State) => state.visibleDate),
  showCurrentTimeIndicator: createSelector((state: State) => state.showCurrentTimeIndicator),
  nowUpdatedEveryMinute: createSelector((state: State) => state.nowUpdatedEveryMinute),
  isMultiDayEvent: createSelector((state: State) => state.isMultiDayEvent),
  processedEventList: createSelectorMemoized(
    (state: State) => state.eventIdList,
    (state: State) => state.processedEventLookup,
    (eventIds, processedEventLookup) => eventIds.map((id) => processedEventLookup.get(id)!),
  ),
  eventIdList: createSelector((state: State) => state.eventIdList),
  eventModelList: createSelector((state: State) => state.eventModelList),
  eventModelLookup: createSelector((state: State) => state.eventModelLookup),
  processedResourceList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.processedResourceLookup,
    (resourceIds, processedResourceLookup) =>
      resourceIds.map((id) => processedResourceLookup.get(id)!),
  ),
  resourceIdList: createSelector((state: State) => state.resourceIdList),
  visibleResourcesMap: createSelector((state: State) => state.visibleResources),
  canCreateNewEvent: createSelector((state: State) => !state.readOnly),
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
  isEventPropertyReadOnly: createSelector(
    isEventReadOnlySelector,
    (state: State) => state.eventModelStructure,
    (isEventReadOnly, eventModelStructure, _eventId: CalendarEventId) => {
      if (isEventReadOnly) {
        return () => true;
      }

      return (property: keyof CalendarEvent) => {
        if (eventModelStructure?.[property] && !eventModelStructure?.[property].setter) {
          return true;
        }

        return false;
      };
    },
  ),
  visibleResourcesList: createSelectorMemoized(
    (state: State) => state.resourceIdList,
    (state: State) => state.visibleResources,
    (resources, visibleResources) =>
      resources
        .filter(
          (resourceId) =>
            !visibleResources.has(resourceId) || visibleResources.get(resourceId) === true,
        )
        .map((resourceId) => resourceId),
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
  canDragEventsFromTheOutside: createSelector(
    (state: State) => state.canDragEventsFromTheOutside && !state.readOnly,
  ),
  canDropEventsToTheOutside: createSelector(
    (state: State) => state.canDropEventsToTheOutside && !state.readOnly,
  ),
  isScopeDialogOpen: createSelector(
    (state: State) => state.pendingUpdateRecurringEventParameters != null,
  ),
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
    (
      adapter,
      date: SchedulerValidDate,
    ): Record<RecurringEventPresetKey, RecurringEventRecurrenceRule> => {
      return {
        daily: {
          freq: 'DAILY',
          interval: 1,
        },
        weekly: {
          freq: 'WEEKLY',
          interval: 1,
          byDay: [getWeekDayCode(adapter, date)],
        },
        monthly: {
          freq: 'MONTHLY',
          interval: 1,
          byMonthDay: [adapter.getDate(date)],
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
    ): RecurringEventPresetKey | 'custom' | null => {
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

      switch (rule.freq) {
        case 'DAILY': {
          // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
          return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
        }

        case 'WEEKLY': {
          // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
          const occurrenceStartWeekDayCode = getWeekDayCode(adapter, occurrenceStart);

          const byDay = rule.byDay ?? [];
          const matchesDefaultByDay =
            byDay.length === 0 || (byDay.length === 1 && byDay[0] === occurrenceStartWeekDayCode);
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
