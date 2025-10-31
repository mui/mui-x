'use client';

import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter, diffIn } from '../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import { selectors } from '../use-event-calendar';
import { useDayList } from '../use-day-list';
import { CalendarProcessedDate, CalendarEventOccurrence } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { AGENDA_VIEW_DAYS_AMOUNT, AGENDA_MAX_HORIZON_DAYS } from '../constants';
import { eventCalendarPreferenceSelectors } from '../event-calendar-selectors';

/**
 * Agenda-specific hook that:
 *  - Builds the day list starting at `date`
 *  - Groups event occurrences by day
 *  - If `showEmptyDays` is false, extends the range forward until it fills `amount` days that contain events (up to a horizon limit)
 */
export function useAgendaEventOccurrencesGroupedByDay(): useAgendaEventOccurrencesGroupedByDayOptions.ReturnValue {
  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();

  const getDayList = useDayList();

  const events = useStore(store, selectors.processedEventList);
  const visibleDate = useStore(store, selectors.visibleDate);
  const showWeekends = useStore(store, eventCalendarPreferenceSelectors.showWeekends);
  const showEmptyDays = useStore(store, eventCalendarPreferenceSelectors.showEmptyDaysInAgenda);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);

  const amount = AGENDA_VIEW_DAYS_AMOUNT;

  return React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (amount <= 0) {
        throw new Error(
          `useAgendaEventOccurrencesGroupedByDay: The 'amount' parameter must be a positive number, but received ${amount}.`,
        );
      }
    }

    // 1) First chunk of days
    let accumulatedDays = getDayList({
      date: visibleDate,
      amount,
      excludeWeekends: !showWeekends,
    });

    // Compute occurrences for the current accumulated range
    let occurrenceMap = innerGetEventOccurrencesGroupedByDay(
      adapter,
      accumulatedDays,
      events,
      visibleResources,
    );

    const hasEvents = (day: CalendarProcessedDate) => (occurrenceMap.get(day.key)?.length ?? 0) > 0;

    // 2) If we show empty days, just return the amount days
    if (showEmptyDays) {
      const finalOccurrences = new Map(
        accumulatedDays.map((d) => [d.key, occurrenceMap.get(d.key) ?? []]),
      );
      return { days: accumulatedDays, occurrencesMap: finalOccurrences };
    }

    // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
    let daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);

    while (daysWithEvents.length < amount) {
      // Stop if the calendar span already reaches the horizon
      const first = accumulatedDays[0]?.value;
      const last = accumulatedDays[accumulatedDays.length - 1]?.value;

      if (first && last) {
        const spanDays =
          diffIn(adapter, adapter.startOfDay(last), adapter.startOfDay(first), 'days') + 1;

        // Hard stop to avoid scanning too far into the future
        if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
          break;
        }
      }

      // Extend forward by one more chunk and recompute occurrences over the accumulated range
      const nextStart = adapter.addDays(
        accumulatedDays[accumulatedDays.length - 1]?.value ?? visibleDate,
        1,
      );

      const more = getDayList({
        date: nextStart,
        amount,
        excludeWeekends: !showWeekends,
      });

      accumulatedDays = accumulatedDays.concat(more);

      occurrenceMap = innerGetEventOccurrencesGroupedByDay(
        adapter,
        accumulatedDays,
        events,
        visibleResources,
      );

      daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
    }

    // Keep occurrences only for the final visible days
    const filledKeys = new Set(daysWithEvents.map((d) => d.key));
    const finalOccurrences = new Map([...occurrenceMap].filter(([key]) => filledKeys.has(key)));

    return { days: daysWithEvents, occurrencesMap: finalOccurrences };
  }, [
    getDayList,
    visibleDate,
    amount,
    showWeekends,
    adapter,
    events,
    visibleResources,
    showEmptyDays,
  ]);
}

export namespace useAgendaEventOccurrencesGroupedByDayOptions {
  export type ReturnValue = {
    /**
     * Final visible days in the agenda.
     */
    days: CalendarProcessedDate[];
    /**
     * The occurrences Map as returned by `useEventOccurrences()`.
     * It should contain the occurrences for each requested day but can also contain occurrences for other days.
     */
    occurrencesMap: Map<string, CalendarEventOccurrence[]>;
  };
}
