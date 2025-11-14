'use client';

import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useAdapter, diffIn } from '../use-adapter/useAdapter';
import { useEventCalendarStoreContext } from '../use-event-calendar-store-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { useDayList } from '../use-day-list';
import { SchedulerProcessedDate, SchedulerEventOccurrence } from '../models';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import { AGENDA_VIEW_DAYS_AMOUNT, AGENDA_MAX_HORIZON_DAYS } from '../constants';
import { eventCalendarPreferenceSelectors } from '../event-calendar-selectors';
import { sortEventOccurrences } from '../utils/event-utils';

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

  const events = useStore(store, schedulerEventSelectors.processedEventList);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);
  const showWeekends = useStore(store, eventCalendarPreferenceSelectors.showWeekends);
  const showEmptyDays = useStore(store, eventCalendarPreferenceSelectors.showEmptyDaysInAgenda);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);
  const resourceParentIds = useStore(store, schedulerResourceSelectors.resourceParentIdLookup);

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
    let occurrenceMap = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days: accumulatedDays,
      events,
      visibleResources,
      resourceParentIds,
    });

    const hasEvents = (day: SchedulerProcessedDate) =>
      (occurrenceMap.get(day.key)?.length ?? 0) > 0;

    // 2) If we show empty days, just return the amount days
    if (showEmptyDays) {
      return accumulatedDays.map((date) => ({
        date,
        occurrences: sortEventOccurrences(occurrenceMap.get(date.key) ?? [], adapter),
      }));
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

      occurrenceMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: accumulatedDays,
        events,
        visibleResources,
        resourceParentIds,
      });

      daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
    }

    return daysWithEvents.map((date) => ({
      date,
      occurrences: sortEventOccurrences(occurrenceMap.get(date.key) ?? [], adapter),
    }));
  }, [
    getDayList,
    visibleDate,
    amount,
    showWeekends,
    adapter,
    events,
    visibleResources,
    showEmptyDays,
    resourceParentIds,
  ]);
}

export namespace useAgendaEventOccurrencesGroupedByDayOptions {
  export type ReturnValue = {
    /**
     * The processed date.
     */
    date: SchedulerProcessedDate;
    /**
     * The occurrences for the day.
     */
    occurrences: SchedulerEventOccurrence[];
  }[];
}
