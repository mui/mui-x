import { createSelectorMemoized } from '@base-ui/utils/store';
import type { EventCalendarState as State } from '../use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '../scheduler-selectors';
import { eventCalendarPreferenceSelectors } from './eventCalendarPreferenceSelectors';
import { eventCalendarViewSelectors } from './eventCalendarViewSelectors';
import { innerGetEventOccurrencesGroupedByDay } from '../use-event-occurrences-grouped-by-day';
import type { EventCalendarFetchRange, SchedulerProcessedDate } from '../models';
import { AGENDA_MAX_HORIZON_DAYS, AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import { getDayList, getDayListFromPlainDates } from '../get-day-list';
import {
  buildTemporalPlainDate,
  createAdapterDate,
} from '../internals/utils/plain-date-utils/adapter';
import { toEpochMs } from '../internals/utils/plain-date-utils/timeZone';

/**
 * The span of days the agenda displays: `dayCount` days from the visible date,
 * or the month of the visible date when `dayCount` is `'month'`.
 */
const baseRange = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  eventCalendarViewSelectors.agendaDayCount,
  (adapter, visibleDate, dayCount): EventCalendarFetchRange =>
    dayCount === 'month'
      ? { start: adapter.startOfMonth(visibleDate), end: adapter.endOfMonth(visibleDate) }
      : { start: visibleDate, end: adapter.addDays(visibleDate, dayCount - 1) },
);

const baseVisibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  baseRange,
  eventCalendarPreferenceSelectors.showWeekends,
  (adapter, range, showWeekends) =>
    getDayList({
      adapter,
      start: range.start,
      end: range.end,
      excludeWeekends: !showWeekends,
    }),
);

/**
 * The last day the agenda scans for events when hiding the empty days.
 * In month mode the agenda stays inside the month, so the scan stops at its last day.
 */
const horizonEndPlainDate = createSelectorMemoized(
  (state: State) => state.adapter,
  schedulerOtherSelectors.visibleDate,
  eventCalendarViewSelectors.agendaDayCount,
  baseRange,
  (adapter, visibleDate, dayCount, range) => {
    const rangeEndPlainDate = buildTemporalPlainDate(adapter, range.end);
    if (dayCount === 'month') {
      return rangeEndPlainDate;
    }
    // A day count beyond the default horizon still scans at least the displayed days
    const horizonPlainDate = buildTemporalPlainDate(adapter, visibleDate).add({
      days: AGENDA_MAX_HORIZON_DAYS - 1,
    });
    return horizonPlainDate.dayNumber > rangeEndPlainDate.dayNumber
      ? horizonPlainDate
      : rangeEndPlainDate;
  },
);

const visibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  eventCalendarViewSelectors.agendaDayCount,
  baseRange,
  baseVisibleDays,
  horizonEndPlainDate,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
  schedulerEventSelectors.processedEventRangeIndex,
  schedulerResourceSelectors.visibleMap,
  schedulerOtherSelectors.recurringEventsPlugin,
  (
    adapter,
    dayCount,
    range,
    baseDays,
    horizonPlainDate,
    displayTimezone,
    showWeekends,
    showEmptyDaysInAgenda,
    eventRangeIndex,
    visibleResources,
    recurringEventsPlugin,
  ) => {
    // In month mode the month's days are the cap, and the horizon keeps the scan inside it
    const amount = dayCount === 'month' ? baseDays.length : dayCount;

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
      eventRangeIndex,
      visibleResources,
      displayTimezone,
      recurringEventsPlugin,
    });

    const hasEvents = (day: SchedulerProcessedDate) =>
      (occurrenceMap.get(day.key)?.length ?? 0) > 0;

    let daysWithEvents = accumulatedDays.filter(hasEvents).slice(0, amount);

    // 3) If we hide empty days, keep extending forward in blocks until we fill `amount` days with events
    // The scanned span is tracked apart from the day list, which skips the hidden weekends.
    const timezone = adapter.getTimezone(range.end);
    let scannedUntilPlainDate = buildTemporalPlainDate(adapter, range.end);
    while (
      daysWithEvents.length < amount &&
      scannedUntilPlainDate.dayNumber < horizonPlainDate.dayNumber
    ) {
      // Extend forward by one more chunk, without passing the horizon
      const nextStartPlainDate = scannedUntilPlainDate.add({ days: 1 });
      const chunkEndPlainDate = nextStartPlainDate.add({
        days: Math.max(amount, AGENDA_VIEW_DAYS_AMOUNT) - 1,
      });
      scannedUntilPlainDate =
        chunkEndPlainDate.dayNumber < horizonPlainDate.dayNumber
          ? chunkEndPlainDate
          : horizonPlainDate;

      const more = getDayListFromPlainDates(
        adapter,
        nextStartPlainDate,
        scannedUntilPlainDate,
        timezone,
        !showWeekends,
      );

      accumulatedDays = accumulatedDays.concat(more);

      occurrenceMap = innerGetEventOccurrencesGroupedByDay({
        adapter,
        days: accumulatedDays,
        eventRangeIndex,
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
  fetchRange: createSelectorMemoized(
    (state: State) => state.adapter,
    baseRange,
    baseVisibleDays,
    horizonEndPlainDate,
    eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
    (
      adapter,
      range,
      baseDays,
      horizonPlainDate,
      showEmptyDaysInAgenda,
    ): EventCalendarFetchRange => {
      // The day list is empty when a short `dayCount` only covers hidden weekend days,
      // so fall back to the bounds of the range.
      const firstDay = baseDays.length > 0 ? baseDays[0].value : adapter.startOfDay(range.start);
      const lastDay =
        baseDays.length > 0 ? baseDays[baseDays.length - 1].value : adapter.startOfDay(range.end);
      if (showEmptyDaysInAgenda) {
        return { start: firstDay, end: lastDay };
      }
      const timezone = adapter.getTimezone(range.end);
      return {
        start: firstDay,
        end: createAdapterDate(adapter, toEpochMs(horizonPlainDate, 0, timezone), timezone),
      };
    },
  ),
};
