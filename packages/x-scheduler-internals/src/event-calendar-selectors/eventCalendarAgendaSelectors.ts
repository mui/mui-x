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

/**
 * The last day the agenda scans for events when hiding the empty days.
 */
const horizonEnd = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  (adapter, visibleDate) =>
    adapter.startOfDay(adapter.addDays(visibleDate, AGENDA_MAX_HORIZON_DAYS - 1)),
);

const visibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  baseVisibleDays,
  horizonEnd,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
  schedulerEventSelectors.processedEventList,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.recurringEventsPlugin,
  (
    adapter,
    visibleDate,
    baseDays,
    horizon,
    displayTimezone,
    showWeekends,
    showEmptyDaysInAgenda,
    events,
    visibleResources,
    recurringEventsPlugin,
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

    // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
    // The scanned span is tracked apart from the day list, which skips the hidden weekends.
    let scannedUntil = adapter.startOfDay(adapter.addDays(visibleDate, amount - 1));
    while (daysWithEvents.length < amount && adapter.isBefore(scannedUntil, horizon)) {
      // Extend forward by one more chunk, without passing the horizon
      const nextStart = adapter.addDays(scannedUntil, 1);
      const nextEnd = adapter.addDays(nextStart, amount - 1);
      scannedUntil = adapter.isBefore(nextEnd, horizon) ? nextEnd : horizon;

      const more = getDayList({
        adapter,
        start: nextStart,
        end: scannedUntil,
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
   * The range to fetch: the base days, or the whole horizon when hiding the empty days.
   */
  visibleRange: createSelectorMemoized(
    baseVisibleDays,
    horizonEnd,
    eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
    (baseDays, horizon, showEmptyDaysInAgenda): EventCalendarVisibleRange => ({
      start: baseDays[0].value,
      end: showEmptyDaysInAgenda ? baseDays[baseDays.length - 1].value : horizon,
    }),
  ),
};
