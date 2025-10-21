// useAgendaEventOccurrencesGroupedByDay.ts
'use client';

import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter, diffIn } from '../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import { selectors } from '../use-event-calendar';
import { useDayList } from '../use-day-list';
import {
  CalendarProcessedDate,
  CalendarEventOccurrence,
  SchedulerValidDate,
  RenderIn,
} from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { MAX_HORIZON_DAYS } from '../constants';

/**
 * Agenda-specific hook that:
 *  - Builds the day list starting at `date`
 *  - Groups event occurrences by day
 *  - If `showEmptyDays` is false, extends the range forward until it fills `amount` days that contain events (up to a horizon limit)
 */
export function useAgendaEventOccurrencesGroupedByDay(
  parameters: useAgendaEventOccurrencesGroupedByDayOptions.Parameters,
): useAgendaEventOccurrencesGroupedByDayOptions.ReturnValue {
  const {
    date,
    amount,
    excludeWeekends = false,
    showEmptyDays = true,
    renderEventIn = 'every-day',
  } = parameters;

  const adapter = useAdapter();
  const store = useEventCalendarStoreContext();
  const events = useStore(store, selectors.events);
  const visibleResources = useStore(store, selectors.visibleResourcesMap);
  const getDayList = useDayList();

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
      date,
      amount,
      excludeWeekends,
    });

    // Compute occurrences for the current accumulated range
    let occurrenceMap = innerGetEventOccurrencesGroupedByDay(
      adapter,
      accumulatedDays,
      renderEventIn,
      events,
      visibleResources,
    );

    const hasEvents = (d: CalendarProcessedDate) => (occurrenceMap.get(d.key)?.length ?? 0) > 0;

    // 2) If we show empty days, just return the amount days
    if (showEmptyDays) {
      const finalDays = accumulatedDays.slice(0, amount);
      const finalOccurrences = new Map(
        finalDays.map((d) => [d.key, occurrenceMap.get(d.key) ?? []]),
      );
      return { days: finalDays, occurrencesMap: finalOccurrences };
    }

    // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
    let filled = accumulatedDays.filter(hasEvents).slice(0, amount);

    while (filled.length < amount) {
      // Stop if the calendar span already reaches the horizon
      const first = accumulatedDays[0]?.value;
      const last = accumulatedDays[accumulatedDays.length - 1]?.value;

      if (first && last) {
        const spanDays =
          diffIn(adapter, adapter.startOfDay(last), adapter.startOfDay(first), 'days') + 1;

        // Hard stop to avoid scanning too far into the future
        if (spanDays >= MAX_HORIZON_DAYS) {
          break;
        }
      }

      // Extend forward by one more chunk and recompute occurrences over the accumulated range
      const nextStart = adapter.addDays(
        accumulatedDays[accumulatedDays.length - 1]?.value ?? date,
        1,
      );

      const more = getDayList({
        date: nextStart,
        amount,
        excludeWeekends,
      });

      accumulatedDays = accumulatedDays.concat(more);

      occurrenceMap = innerGetEventOccurrencesGroupedByDay(
        adapter,
        accumulatedDays,
        renderEventIn,
        events,
        visibleResources,
      );

      filled = accumulatedDays.filter(hasEvents).slice(0, amount);
    }

    // Keep occurrences only for the final visible days
    const filledKeys = new Set(filled.map((d) => d.key));
    const finalOccurrences = new Map([...occurrenceMap].filter(([key]) => filledKeys.has(key)));

    return { days: filled, occurrencesMap: finalOccurrences };
  }, [
    amount,
    getDayList,
    date,
    excludeWeekends,
    adapter,
    renderEventIn,
    events,
    visibleResources,
    showEmptyDays,
  ]);
}

export namespace useAgendaEventOccurrencesGroupedByDayOptions {
  export interface Parameters {
    /**
     * The start date to get the days for.
     */
    date: SchedulerValidDate;
    /**
     * The amount of days to display, we keep this stable when possible.
     */
    amount: number;
    /**
     * Whether to exclude weekends (Saturday and Sunday) from the returned days.
     * @default false
     */
    excludeWeekends?: boolean;
    /**
     * Whether empty days (days without events) are shown.
     * If false, the hook extends the forward range so the final list still contains `amount` days when possible.
     * @default true
     */
    showEmptyDays?: boolean;
    /**
     * The days a multi-day event should appear on.
     * If "first-day", the event appears only on its starting day.
     * If "every-day", the event appears on each day it spans.
     */
    renderEventIn: RenderIn;
  }

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
