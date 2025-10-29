import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEvent, CalendarEventOccurrence, CalendarProcessedDate } from '../models';
import { getDaysTheOccurrenceIsVisibleOn, getOccurrencesFromEvents } from '../utils/event-utils';
import { useAdapter } from '../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import { selectors } from '../use-event-calendar';
import { Adapter } from '../use-adapter/useAdapter.types';

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
  const events = useStore(store, selectors.processedEventList);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  return React.useMemo(
    () => innerGetEventOccurrencesGroupedByDay(adapter, days, events, visibleResources),
    [adapter, days, events, visibleResources],
  );
}

export namespace useEventOccurrencesGroupedByDay {
  export interface Parameters {
    /**
     * The days to get the occurrences for.
     */
    days: CalendarProcessedDate[];
  }

  export type ReturnValue = Map<string, CalendarEventOccurrence[]>;
}

/**
 * Do not use directly, use the `useEventOccurrencesGroupedByDay` hook instead.
 * This is only exported for testing purposes.
 */
export function innerGetEventOccurrencesGroupedByDay(
  adapter: Adapter,
  days: CalendarProcessedDate[],
  events: CalendarEvent[],
  visibleResources: Map<string, boolean>,
): Map<string, CalendarEventOccurrence[]> {
  // STEP 4: Create a Map of the occurrences grouped by day
  const occurrencesGroupedByDay = new Map<
    string,
    Record<'allDay' | 'nonAllDay', CalendarEventOccurrence[]>
  >(days.map((day) => [day.key, { allDay: [], nonAllDay: [] }]));

  const start = adapter.startOfDay(days[0].value);
  const end = adapter.endOfDay(days[days.length - 1].value);
  const occurrences = getOccurrencesFromEvents({ adapter, start, end, events, visibleResources });

  for (const occurrence of occurrences) {
    const eventDays = getDaysTheOccurrenceIsVisibleOn(occurrence, days, adapter);
    for (const dayKey of eventDays) {
      const occurrenceType = occurrence.allDay ? 'allDay' : 'nonAllDay';
      occurrencesGroupedByDay.get(dayKey)![occurrenceType].push(occurrence);
    }
  }

  // STEP 5: Make sure the all-day events are before the non-all-day events
  const cleanMap: useEventOccurrencesGroupedByDay.ReturnValue = new Map();
  occurrencesGroupedByDay.forEach((value, key) => {
    cleanMap.set(key, [...value.allDay, ...value.nonAllDay]);
  });

  return cleanMap;
}
