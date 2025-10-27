import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import {
  CalendarEvent,
  CalendarEventId,
  CalendarResource,
  CalendarResourceId,
  RecurringEventPresetKey,
  RecurringEventRecurrenceRule,
  SchedulerValidDate,
} from '../../models';
import { SchedulerState as State } from './SchedulerStore.types';
import { getWeekDayCode } from '../recurring-event-utils';

interface CalendarResourceWithParentId extends CalendarResource {
  parentId: null | CalendarResourceId;
}

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

const resourcesByIdFlatMapSelector = createSelectorMemoized(
  (state: State) => state.resources,
  (resources) => {
    const map = new Map<CalendarResourceId | null | undefined, CalendarResourceWithParentId>();
    const addResourceToMap = (resource: CalendarResource, parentId: null | CalendarResourceId) => {
      const { children, ...resourceWithoutChildren } = resource;
      map.set(resource.id, { ...resourceWithoutChildren, parentId });

      if (children) {
        for (const child of children) {
          addResourceToMap(child, resource.id);
        }
      }
    };

    for (const resource of resources) {
      addResourceToMap(resource, null);
    }
    return map;
  },
);

const resourcesFlatArraySelector = createSelectorMemoized(
  (state: State) => state.resources,
  (resources) => {
    const flatArray: CalendarResource[] = [];

    const addResourceAndChildren = (resource: CalendarResource) => {
      const { children, ...resourceWithoutChildren } = resource;
      flatArray.push(resourceWithoutChildren);

      if (children) {
        for (const child of children) {
          addResourceAndChildren(child);
        }
      }
    };

    for (const resource of resources) {
      addResourceAndChildren(resource);
    }
    return flatArray;
  },
);

const resourceSelector = createSelector(
  resourcesByIdFlatMapSelector,
  (resourcesByIdFlatMap, resourceId: string | null | undefined) =>
    resourcesByIdFlatMap.get(resourceId),
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
  resourcesFlatArray: resourcesFlatArraySelector,
  events: createSelector((state: State) => state.events),
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
  visibleResourcesList: createSelectorMemoized(
    (state: State) => state.resources,
    (state: State) => state.visibleResources,
    (resources, visibleResources) => {
      const result: CalendarResourceId[] = [];

      const addResourceAndChildren = (resource: CalendarResource) => {
        const isVisible =
          !visibleResources.has(resource.id) || visibleResources.get(resource.id) === true;

        if (isVisible) {
          result.push(resource.id);
          if (resource.children) {
            for (const child of resource.children) {
              addResourceAndChildren(child);
            }
          }
        }
      };

      for (const resource of resources) {
        addResourceAndChildren(resource);
      }

      return result;
    },
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
