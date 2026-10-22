import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventOccurrence, SchedulerProcessedDate } from '../models';
import type { GetOccurrencesFromEventsParameters } from '../internals/utils/event-utils';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
} from '../internals/utils/event-utils';
import { useAdapterContext } from '../use-adapter-context';
import { createAdapterDate } from '../internals/utils/plain-date-utils/adapter';
import { getEndOfDayMs, getStartOfDayMs } from '../internals/utils/plain-date-utils/timeZone';
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
  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const eventRangeIndex = useStore(store, schedulerEventSelectors.processedEventRangeIndex);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);

  return React.useMemo(
    () =>
      innerGetEventOccurrencesGroupedByDay({
        adapter,
        days,
        eventRangeIndex,
        visibleResources,
        displayTimezone,
        recurringEventsPlugin,
      }),
    [adapter, days, eventRangeIndex, visibleResources, displayTimezone, recurringEventsPlugin],
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
  parameters: Omit<GetOccurrencesFromEventsParameters, 'start' | 'end'> & {
    days: SchedulerProcessedDate[];
  },
): Map<string, SchedulerEventOccurrence[]> {
  const {
    adapter,
    days,
    eventRangeIndex,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
  } = parameters;

  const occurrenceMap = new Map<string, SchedulerEventOccurrence[]>(
    days.map((day) => [day.key, []]),
  );

  if (days.length === 0) {
    return occurrenceMap;
  }

  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const startTimezone = adapter.getTimezone(firstDay.value);
  const endTimezone = adapter.getTimezone(lastDay.value);
  const start = createAdapterDate(
    adapter,
    getStartOfDayMs(firstDay.timestamp, startTimezone),
    startTimezone,
  );
  const end = createAdapterDate(
    adapter,
    getEndOfDayMs(lastDay.timestamp, endTimezone),
    endTimezone,
  );
  const occurrences = getOccurrencesFromEvents({
    adapter,
    start,
    end,
    eventRangeIndex,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
  });

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter);
    for (const dayKey of eventDays) {
      occurrenceMap.get(dayKey)!.push(occurrence);
    }
  }

  return occurrenceMap;
}
