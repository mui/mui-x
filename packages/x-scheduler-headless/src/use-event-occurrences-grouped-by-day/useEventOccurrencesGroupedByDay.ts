import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { SchedulerEventOccurrence, SchedulerProcessedDate } from '../models';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
  GetOccurrencesFromEventsParameters,
} from '../internals/utils/event-utils';
import { useAdapter } from '../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';

/**
 * Gets all the event occurrences for the given days.
 * For recurring events, it expands them to get all the occurrences that fall within the given days.
 * It should be called once per view to get the occurrences for all the visible days in one go.
 * The returned value is a Map where the key is the day key and the value is the list of occurrences for that day.
 */
export function useEventOccurrencesGroupedByDay(
  parameters: useEventOccurrencesGroupedByDay.Parameters,
): useEventOccurrencesGroupedByDay.ReturnValue {
  const { days } = parameters;
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const events = useStore(store, schedulerEventSelectors.processedEventList);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const resourceParentIds = useStore(store, schedulerResourceSelectors.resourceParentIdLookup);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

  return React.useMemo(
    () =>
      innerGetEventOccurrencesGroupedByDay({
        adapter,
        days,
        events,
        visibleResources,
        resourceParentIds,
        displayTimezone,
      }),
    [adapter, days, events, visibleResources, resourceParentIds, displayTimezone],
  );
}

export namespace useEventOccurrencesGroupedByDay {
  export interface Parameters {
    /**
     * The days to get the occurrences for.
     */
    days: SchedulerProcessedDate[];
  }

  export type ReturnValue = Map<string, SchedulerEventOccurrence[]>;
}

/**
 * Do not use directly, use the `useEventOccurrencesGroupedByDay` hook instead.
 * This is only exported for testing purposes.
 */
export function innerGetEventOccurrencesGroupedByDay(
  parameters: Pick<
    GetOccurrencesFromEventsParameters,
    'adapter' | 'visibleResources' | 'events' | 'resourceParentIds' | 'displayTimezone'
  > & { days: SchedulerProcessedDate[] },
): Map<string, SchedulerEventOccurrence[]> {
  const { adapter, days, events, visibleResources, resourceParentIds, displayTimezone } =
    parameters;

  const occurrenceMap = new Map<string, SchedulerEventOccurrence[]>(
    days.map((day) => [day.key, []]),
  );

  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    events,
    visibleResources,
    resourceParentIds,
    displayTimezone,
  });

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter);
    for (const dayKey of eventDays) {
      occurrenceMap.get(dayKey)!.push(occurrence);
    }
  }

  return occurrenceMap;
}
