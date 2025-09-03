import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { CalendarEventOccurrence, CalendarProcessedDate, SchedulerValidDate } from '../models';
import { getDateKey, getEventDays } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurrence-utils';
import { useEventCalendarContext } from '../utils/useEventCalendarContext';
import { selectors } from '../use-event-calendar';

/**
 * Retrieves all the occurrences for the given days.
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
    const occurrencesGroupedByDay: useEventOccurrences.ReturnValue = new Map();
    for (const day of days) {
      occurrencesGroupedByDay.set(day.key, []);
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

      // STEP 2-B: Non-recurring event processing, check if the event is within the visible days
      if (adapter.isAfter(event.start, end) || adapter.isBefore(event.end, start)) {
        continue; // Skip events that are not in the visible days
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
        occurrencesGroupedByDay.get(dayKey)!.push(occurrence);
      }
    }

    return new Map([
      ...occurrencesGroupedByDay.entries().map(
        ([key, value]) =>
          [
            key,
            value.sort((a, b) => {
              if (a.allDay && !b.allDay) {
                return -1;
              }
              if (b.allDay && !a.allDay) {
                return 1;
              }
              return 0;
            }),
          ] as const,
      ),
    ]);
  }, [adapter, days, eventPlacement, events, visibleResources]);
}

export namespace useEventOccurrences {
  export interface Parameters {
    days: CalendarProcessedDate[];
    eventPlacement: 'first-day' | 'every-day';
  }

  export type ReturnValue = Map<string, CalendarEventOccurrence[]>;
}
