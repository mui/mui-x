import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import type { EventCalendarVisibleRange, SchedulerProcessedDate } from '../models';
import { AGENDA_MAX_HORIZON_DAYS, AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import { getDayList } from '../get-day-list';

const baseVisibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  eventCalendarPreferenceSelectors.showWeekends,
  (adapter, visibleDate, showWeekends) =>
    getDayList({
      adapter,
      start: visibleDate,
      end: adapter.addDays(visibleDate, AGENDA_VIEW_DAYS_AMOUNT - 1),
      excludeWeekends: !showWeekends,
    }),
);

const visibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  baseVisibleDays,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.recurringEventsPlugin,
  schedulerOtherSelectors.isLoading,
  (
    adapter,
    baseDays,
    displayTimezone,
    showWeekends,
    showEmptyDaysInAgenda,
    events,
    visibleResources,
    recurringEventsPlugin,
    isLoading,
  ) => {
    const amount = AGENDA_VIEW_DAYS_AMOUNT;

    // 1) First chunk of days
    let accumulatedDays = baseDays;

    // 2) If we show empty days, just return the amount days
    if (showEmptyDaysInAgenda) {
      return accumulatedDays;
    }

    // Compute occurrences for the current accumulated range
    let occurrenceMap = innerGetEventOccurrencesGroupedByDay({
      adapter,
      days: accumulatedDays,
      events,
      visibleResources,
      displayTimezone,
      recurringEventsPlugin,
    });

    const hasEvents = (day: SchedulerProcessedDate) =>
      (occurrenceMap.get(day.key)?.length ?? 0) > 0;

    let daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);

    // While loading, keep the known event days so the fetched range stays put.
    // With none, show the base days so the skeletons have rows.
    if (isLoading && daysWithEvents.length === 0) {
      return accumulatedDays;
    }

    // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
    while (daysWithEvents.length < amount) {
      // Stop if the calendar span already reaches the horizon
      const first = accumulatedDays[0]?.value;
      const last = accumulatedDays[accumulatedDays.length - 1]?.value;

      if (first && last) {
        const spanDays =
          adapter.differenceInDays(adapter.startOfDay(last), adapter.startOfDay(first)) + 1;

        // Hard stop to avoid scanning too far into the future
        if (spanDays >= AGENDA_MAX_HORIZON_DAYS) {
          break;
        }
      }

      // Extend forward by one more chunk and recompute occurrences over the accumulated range
      const nextStart = adapter.addDays(last ?? baseDays[0].value, 1);

      const more = getDayList({
        adapter,
        start: nextStart,
        end: adapter.addDays(nextStart, amount),
        excludeWeekends: !showWeekends,
      });

      accumulatedDays = accumulatedDays.concat(more);

      occurrenceMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: accumulatedDays,
        events,
        visibleResources,
        displayTimezone,
        recurringEventsPlugin,
      });

      daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);
    }

    return daysWithEvents;
  },
);

export const eventCalendarAgendaSelectors = {
  /**
   * The days from the visible date, before hiding the empty ones.
   */
  baseVisibleDays,
  visibleDays,
  /**
   * The range to fetch: the visible days, or the base days when none has events.
   */
  visibleRange: createSelectorMemoized(
    visibleDays,
    baseVisibleDays,
    (days, baseDays): EventCalendarVisibleRange => {
      const list = days.length > 0 ? days : baseDays;
      return { start: list[0].value, end: list[list.length - 1].value };
    },
  ),
};
