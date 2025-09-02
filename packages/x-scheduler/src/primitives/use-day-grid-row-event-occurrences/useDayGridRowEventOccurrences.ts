import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarDayWithVisibleOccurrences,
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowIndex,
  SchedulerValidDate,
} from '../models';
import {
  getEventDays,
  getEventRowIndex,
  GetEventRowIndexParameters,
  processDate,
} from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurrence-utils';
import { useEventCalendarContext } from '../utils/useEventCalendarContext';
import { selectors } from '../use-event-calendar';

export function useDayGridRowEventOccurrences(
  parameters: useDayGridRowEventOccurrences.Parameters,
): useDayGridRowEventOccurrences.ReturnValue {
  const adapter = useAdapter();
  const days = useDaysWithEventOccurrences(parameters);

  return React.useMemo(() => {
    const firstDayInRow = days[0];
    return days.map((day) => {
      const regularEvents: CalendarEventOccurrence[] = [];
      const allDayEvents: CalendarEventOccurrencesWithRowIndex[] = [];
      const rowIndexLookup: GetEventRowIndexParameters['rowIndexLookup'] = {};

      for (const occurrence of day.occurrences) {
        // STEP 4.1: Process all-day events and get their position in the row
        if (occurrence.allDay) {
          const eventRowIndex = getEventRowIndex({
            adapter,
            rowIndexLookup,
            firstDayInRow,
            occurrence,
            day,
          });

          allDayEvents.push({
            ...occurrence,
            eventRowIndex,
          });

          if (!rowIndexLookup[day.key]) {
            rowIndexLookup[day.key] = { occurrencesRowIndex: {}, usedRowIndexes: new Set() };
          }
          rowIndexLookup[day.key].occurrencesRowIndex[occurrence.key] = eventRowIndex;
          rowIndexLookup[day.key].usedRowIndexes.add(eventRowIndex);
        } else {
          regularEvents.push(occurrence);
        }
      }

      return {
        ...day,
        regularEvents,
        allDayEvents,
      };
    });
  }, [adapter, days]);
}

export namespace useDayGridRowEventOccurrences {
  export interface Parameters {}

  export type ReturnValue = {
    day: SchedulerValidDate;
    regularEvents: CalendarEventOccurrence[];
    allDayEvents: CalendarEventOccurrencesWithRowIndex[];
  }[];
}

export function useDaysWithEventOccurrences(
  parameters: useDaysWithVisibleEventOccurrences.Parameters,
): useDaysWithVisibleEventOccurrences.ReturnValue {
  const { days: daysParam, eventPlacement } = parameters;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  return React.useMemo(() => {
    const occurrencesGroupedByDay = new Map<string, CalendarEventOccurrence[]>();
    const days = daysParam.map((date) => processDate(date, adapter));

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
        const dayKey = adapter.format(day, 'keyboardDate');
        occurrencesGroupedByDay.get(dayKey)!.push(occurrence);
      }
    }

    return days.map((day) => {
      return {
        ...day,
        occurrences: occurrencesGroupedByDay.get(day.key)!,
      };
    });
  }, [adapter, daysParam, eventPlacement, events, visibleResources]);
}

export namespace useDaysWithVisibleEventOccurrences {
  export interface Parameters {
    days: SchedulerValidDate[];
    eventPlacement: 'first-day' | 'every-day';
  }

  export type ReturnValue = CalendarDayWithVisibleOccurrences[];
}
