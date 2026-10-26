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
import { getDayListFromPlainDates } from '../get-day-list';
import type { PlainDate } from '../internals/utils/base-temporal/PlainDate';
import { toPlainDateTime } from '../internals/utils/plain-date-utils/timeZone';

/**
 * The span of days the agenda displays: `dayCount` days from the visible date,
 * or the month of the visible date when `dayCount` is `'month'`.
 */
const baseRange = createSelectorMemoized(
  schedulerOtherSelectors.visiblePlainDate,
  eventCalendarViewSelectors.agendaDayCount,
  (visiblePlainDate, dayCount): { start: PlainDate; end: PlainDate } =>
    dayCount === 'month'
      ? {
          start: visiblePlainDate.with({ day: 1 }),
          end: visiblePlainDate.with({ day: visiblePlainDate.daysInMonth }),
        }
      : { start: visiblePlainDate, end: visiblePlainDate.add({ days: dayCount - 1 }) },
);

const baseVisibleDays = createSelectorMemoized(
  (state: State) => state.adapter,
  baseRange,
  schedulerOtherSelectors.displayTimezone,
  eventCalendarPreferenceSelectors.showWeekends,
  (adapter, range, displayTimezone, showWeekends) =>
    getDayListFromPlainDates({
      adapter,
      firstPlainDate: range.start,
      lastPlainDate: range.end,
      timezone: displayTimezone,
      excludeWeekends: !showWeekends,
    }),
);

/**
 * The last day the agenda scans for events when hiding the empty days.
 * In month mode the agenda stays inside the month, so the scan stops at its last day.
 */
const horizonEndPlainDate = createSelectorMemoized(
  eventCalendarViewSelectors.agendaDayCount,
  baseRange,
  (dayCount, range) => {
    if (dayCount === 'month') {
      return range.end;
    }
    // A day count beyond the default horizon still scans at least the displayed days
    const horizonPlainDate = range.start.add({ days: AGENDA_MAX_HORIZON_DAYS - 1 });
    return horizonPlainDate.dayNumber > range.end.dayNumber ? horizonPlainDate : range.end;
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
    let scannedUntilPlainDate = range.end;
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

      const more = getDayListFromPlainDates({
        adapter,
        firstPlainDate: nextStartPlainDate,
        lastPlainDate: scannedUntilPlainDate,
        timezone: displayTimezone,
        excludeWeekends: !showWeekends,
      });

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
    baseRange,
    baseVisibleDays,
    horizonEndPlainDate,
    schedulerOtherSelectors.displayTimezone,
    eventCalendarPreferenceSelectors.showEmptyDaysInAgenda,
    (
      range,
      baseDays,
      horizonPlainDate,
      displayTimezone,
      showEmptyDaysInAgenda,
    ): EventCalendarFetchRange => {
      // The day list is empty when a short `dayCount` only covers hidden weekend days,
      // so fall back to the bounds of the range.
      const firstDay =
        baseDays.length > 0
          ? toPlainDateTime(baseDays[0].timestamp, displayTimezone).date
          : range.start;
      const lastDay =
        baseDays.length > 0
          ? toPlainDateTime(baseDays[baseDays.length - 1].timestamp, displayTimezone).date
          : range.end;
      if (showEmptyDaysInAgenda) {
        return { start: firstDay, end: lastDay };
      }
      return { start: firstDay, end: horizonPlainDate };
    },
  ),
};
