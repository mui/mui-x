import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import {
  CalendarEventOccurrence,
  CalendarEventOccurrencesWithRowIndex,
  SchedulerValidDate,
} from '../models';
import { getEventDays, getEventRowIndex } from '../utils/event-utils';
import { useAdapter } from '../utils/adapter/useAdapter';
import { getRecurringEventOccurrencesForVisibleDays } from '../utils/recurrence-utils';
import { useEventCalendarContext } from '../utils/useEventCalendarContext';
import { selectors } from '../use-event-calendar';

export function useDayGridRowEventOccurrences(
  parameters: useDayGridRowEventOccurrences.Parameters,
): useDayGridRowEventOccurrences.ReturnValue {
  const { days, shouldOnlyRenderEventInOneCell } = parameters;
  const adapter = useAdapter();
  const { store } = useEventCalendarContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  return React.useMemo(() => {
    const daysMap = new Map<
      string,
      { events: CalendarEventOccurrence[]; allDayEvents: CalendarEventOccurrencesWithRowIndex[] }
    >();
    for (const day of days) {
      const dayKey = adapter.format(day, 'keyboardDate');
      daysMap.set(dayKey, { events: [], allDayEvents: [] });
    }

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
      const eventFirstDay = adapter.startOfDay(event.start);
      const eventLastDay = adapter.endOfDay(event.end);
      if (
        adapter.isAfter(eventFirstDay, days[days.length - 1]) ||
        adapter.isBefore(eventLastDay, days[0])
      ) {
        continue; // Skip events that are not in the visible days
      }

      visibleOccurrences.push({ ...event, key: String(event.id) });
    }

    // STEP 3: Sort by the actual start date of each occurrence
    // We sort here so that events are processed in the correct order, ensuring consistent row index assignment for all-day events
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
        shouldOnlyRenderEventInOneCell,
      );

      for (const day of eventDays) {
        const dayKey = adapter.format(day, 'keyboardDate');
        if (!daysMap.has(dayKey)) {
          daysMap.set(dayKey, { events: [], allDayEvents: [] });
        }

        // STEP 4.1: Process all-day events and get their position in the row
        if (occurrence.allDay) {
          const eventRowIndex = getEventRowIndex(occurrence, day, days, daysMap, adapter);

          daysMap.get(dayKey)!.allDayEvents.push({
            ...occurrence,
            eventRowIndex,
          });
        } else {
          daysMap.get(dayKey)!.events.push(occurrence);
        }
      }
    }

    return days.map((day) => {
      const dayKey = adapter.format(day, 'keyboardDate');
      return {
        day,
        events: daysMap.get(dayKey)?.events || [],
        allDayEvents: daysMap.get(dayKey)?.allDayEvents || [],
      };
    });
  }, [adapter, visibleResources, events, days, shouldOnlyRenderEventInOneCell]);
}

export namespace useDayGridRowEventOccurrences {
  export interface Parameters {
    days: SchedulerValidDate[];
    shouldOnlyRenderEventInOneCell: boolean;
  }

  export type ReturnValue = {
    day: SchedulerValidDate;
    events: CalendarEventOccurrence[];
    allDayEvents: CalendarEventOccurrencesWithRowIndex[];
  }[];
}
