import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEventOccurrence, CalendarProcessedDate, SchedulerValidDate } from '../models';
import { getDateKey, getEventDays } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurrence-utils';
import { useEventCalendarContext } from '../utils/useEventCalendarContext';
import { selectors } from '../use-event-calendar';

/**
 * Gets all the event occurrences for the given days.
 * For recurring events, it expands them to get all the occurrences that fall within the given days.
 * It should be called once per view to get the occurrences for all the visible days in one go.
 * The returned value is a Map where the key is the day key and the value is the list of occurrences for that day.
 */
export function useEventOccurrences(
  parameters: useEventOccurrences.Parameters,
): useEventOccurrences.ReturnValue {
  const { days, eventPlacement } = parameters;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  return React.useMemo(() => {
    const occurrencesGroupedByDay = new Map<
      string,
      { allDay: CalendarEventOccurrence[]; nonAllDay: CalendarEventOccurrence[] }
    >();
    for (const day of days) {
      occurrencesGroupedByDay.set(day.key, { allDay: [], nonAllDay: [] });
    }

    const start = adapter.startOfDay(days[0].value);
    const end = adapter.endOfDay(days[days.length - 1].value);

    // Collect ALL event occurrences (both recurring and non-recurring)
    const visibleOccurrences: CalendarEventOccurrence[] = [];

    for (const event of events) {
      // STEP 1: Skip events from resources that are not visible
      if (event.resource && visibleResources.get(event.resource) === false) {
        continue;
      }

      // STEP 2-A: Recurrent event processing, if it is recurrent expand it for the visible days
      if (event.rrule) {
        const occurrences = getRecurringEventOccurrencesForVisibleDays(event, days, adapter);
        visibleOccurrences.push(...occurrences);
        continue;
      }

      // STEP 2-B: Non-recurring event processing, skip events that are not within the visible days
      if (adapter.isAfter(event.start, end) || adapter.isBefore(event.end, start)) {
        continue;
      }

      visibleOccurrences.push({ ...event, key: String(event.id) });
    }

    // STEP 3: Sort by the actual start date of each occurrence
    // We sort here so that events are processed in the correct order
    const sortedOccurrences = visibleOccurrences
      // TODO: Avoid JS Date conversion
      .map((occurrence) => ({
        occurrence,
        timestamp: adapter.toJsDate(occurrence.start).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => item.occurrence);

    // STEP 4: Add the occurrence to the days map
    for (const occurrence of sortedOccurrences) {
      const eventDays: SchedulerValidDate[] = getEventDays(
        occurrence,
        days,
        adapter,
        eventPlacement,
      );

      for (const day of eventDays) {
        const dayKey = getDateKey(day, adapter);
        const occurrenceType = occurrence.allDay ? 'allDay' : 'nonAllDay';
        occurrencesGroupedByDay.get(dayKey)![occurrenceType].push(occurrence);
      }
    }

    const cleanMap: useEventOccurrences.ReturnValue = new Map();
    occurrencesGroupedByDay.forEach((value, key) => {
      cleanMap.set(key, [...value.allDay, ...value.nonAllDay]);
    });

    return cleanMap;
  }, [adapter, days, eventPlacement, events, visibleResources]);
}

export namespace useEventOccurrences {
  export interface Parameters {
    /**
     * The days to get the occurrences for.
     */
    days: CalendarProcessedDate[];
    /**
     * The days a multi-day event should appear on.
     * If "first-day", the event appears only on its starting day.
     * If "every-day", the event appears on each day it spans.
     */
    eventPlacement: 'first-day' | 'every-day';
  }

  export type ReturnValue = Map<string, CalendarEventOccurrence[]>;
}
