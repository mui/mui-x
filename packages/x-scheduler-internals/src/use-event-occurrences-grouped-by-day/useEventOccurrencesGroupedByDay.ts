import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerEventOccurrence, SchedulerProcessedDay } from '../models';
import type { GetOccurrencesFromEventsParameters } from '../internals/utils/event-utils';
import {
  getDaysTheOccurrenceIsVisibleOn,
  getOccurrencesFromEvents,
} from '../internals/utils/event-utils';
import { getEndOfDayMs } from '../internals/utils/plain-date-utils/timeZone';
import { getDayNumber } from '../internals/utils/plain-date-utils/plainDate';
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
  const store = useEventCalendarStoreContext();
  const eventRangeIndex = useStore(store, schedulerEventSelectors.processedEventRangeIndex);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const recurringEventsPlugin = useStore(store, schedulerOtherSelectors.recurringEventsPlugin);

  return React.useMemo(
    () =>
      innerGetEventOccurrencesGroupedByDay({
        days,
        eventRangeIndex,
        visibleResources,
        displayTimezone,
        recurringEventsPlugin,
      }),
    [days, eventRangeIndex, visibleResources, displayTimezone, recurringEventsPlugin],
  );
}

export namespace useEventOccurrencesGroupedByDay {
  export interface Parameters {
    /**
     * The days to get the occurrences for.
     */
    days: SchedulerProcessedDay[];
  }

  export type ReturnValue = Map<string, SchedulerEventOccurrence[]>;
}

/**
 * Do not use directly in a component, use the `useEventOccurrencesGroupedByDay` hook instead.
 * Selectors that group the occurrences outside of React call it directly.
 */
export function innerGetEventOccurrencesGroupedByDay(
  parameters: Omit<GetOccurrencesFromEventsParameters, 'start' | 'end'> & {
    days: SchedulerProcessedDay[];
  },
): Map<string, SchedulerEventOccurrence[]> {
  const { days, eventRangeIndex, visibleResources, displayTimezone, recurringEventsPlugin } =
    parameters;

  const occurrenceMap = new Map<string, SchedulerEventOccurrence[]>(
    days.map((day) => [day.key, []]),
  );

  if (days.length === 0) {
    return occurrenceMap;
  }

  const dayNumbers = days.map((day) => getDayNumber(day.plainDate));
  const visibleRanges = getVisibleRanges(days, dayNumbers, displayTimezone);
  const occurrences = getOccurrencesFromEvents({
    start: visibleRanges[0].start,
    end: visibleRanges[visibleRanges.length - 1].end,
    eventRangeIndex,
    visibleResources,
    displayTimezone,
    recurringEventsPlugin,
    // Without hidden days, the range is enough.
    visibleRanges: visibleRanges.length > 1 ? visibleRanges : undefined,
  });

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(
      occurrence,
      days,
      dayNumbers,
      displayTimezone,
    );
    for (const dayKey of eventDays) {
      occurrenceMap.get(dayKey)!.push(occurrence);
    }
  }

  return occurrenceMap;
}

/**
 * The runs of consecutive days, from the first instant of their first day to the last instant of
 * their last day.
 */
function getVisibleRanges(
  days: SchedulerProcessedDay[],
  dayNumbers: number[],
  displayTimezone: string,
): { start: number; end: number }[] {
  const ranges: { start: number; end: number }[] = [];
  let runStart = 0;
  for (let i = 1; i <= days.length; i += 1) {
    if (i === days.length || dayNumbers[i] !== dayNumbers[i - 1] + 1) {
      // The days start on their first instant.
      ranges.push({
        start: days[runStart].timestamp,
        end: getEndOfDayMs(days[i - 1].timestamp, displayTimezone),
      });
      runStart = i;
    }
  }
  return ranges;
}
