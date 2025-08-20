import {
  SchedulerValidDate,
  CalendarEvent,
  CalendarEventOccurenceWithPosition,
  CalendarEventOccurence,
  RRuleSpec,
  ByDayCode,
} from '../models';
import { Adapter } from './adapter/types';
import { diffIn, mergeDateAndTime } from './date-utils';
import { BYDAY_TO_NUM, NUM_TO_BYDAY, weeklyByDayCodes } from './recurrence-utils';

export function getEventWithLargestRowIndex(events: CalendarEventOccurenceWithPosition[]) {
  return (
    events.reduce(
      (maxEvent, event) =>
        (event?.eventRowIndex ?? 0) > (maxEvent.eventRowIndex ?? 0) ? event : maxEvent,
      { eventRowIndex: 0 } as CalendarEventOccurenceWithPosition,
    ).eventRowIndex || 0
  );
}

export function isDayWithinRange(
  day: SchedulerValidDate,
  eventFirstDay: SchedulerValidDate,
  eventLastDay: SchedulerValidDate,
  adapter: Adapter,
) {
  return (
    adapter.isSameDay(day, eventFirstDay) ||
    adapter.isSameDay(day, eventLastDay) ||
    (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay))
  );
}

export function getEventRowIndex(
  event: CalendarEventOccurence,
  day: SchedulerValidDate,
  days: SchedulerValidDate[],
  daysMap: Map<string, { allDayEvents: CalendarEventOccurenceWithPosition[] }>,
  adapter: Adapter,
): number {
  const dayKey = adapter.format(day, 'keyboardDate');
  const eventFirstDay = adapter.startOfDay(event.start);

  // If the event starts before the current day, we need to find the row index of the first day of the event
  const isBeforeVisibleRange =
    adapter.isBefore(eventFirstDay, day) && !adapter.isSameDay(days[0], day);
  if (isBeforeVisibleRange) {
    const firstDayKey = adapter.format(
      adapter.isBefore(eventFirstDay, days[0]) ? days[0] : eventFirstDay,
      'keyboardDate',
    );

    // Try to find the row index from the original event placement on the first visible day
    const existingRowIndex = daysMap
      .get(firstDayKey)
      ?.allDayEvents.find((currentEvent) => currentEvent.key === event.key)?.eventRowIndex;

    return existingRowIndex ?? 1;
  }

  // Otherwise, we just render the event on the first available row in the column
  const usedIndexes = new Set(
    daysMap.get(dayKey)?.allDayEvents.map((item) => item.eventRowIndex) ?? [],
  );
  let i = 1;
  while (usedIndexes.has(i)) {
    i += 1;
  }
  return i;
}

export function getEventDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
  shouldOnlyRenderEventInOneCell: boolean,
) {
  const eventFirstDay = adapter.startOfDay(event.start);
  const eventLastDay = adapter.endOfDay(event.end);

  if (shouldOnlyRenderEventInOneCell) {
    if (adapter.isBefore(eventFirstDay, days[0])) {
      return [days[0]];
    }
    return [eventFirstDay];
  }
  return days.filter((day) => isDayWithinRange(day, eventFirstDay, eventLastDay, adapter));
}

export function getAllDaySpanDays(adapter: Adapter, event: CalendarEvent): number {
  // TODO: Now only all-day events are implemented, we should add support for timed events that span multiple days later
  if (!event.allDay) {
    return 1;
  }
  // +1 so start/end same day = 1 day, spans include last day
  return Math.max(
    1,
    diffIn(adapter, adapter.startOfDay(event.end), adapter.startOfDay(event.start), 'days') + 1,
  );
}

export function expandRecurringEventForVisibleDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
): CalendarEventOccurence[] {
  const rule = event.rrule!;
  const instances: CalendarEventOccurence[] = [];

  const endGuard = buildEndGuard(rule, event.start, adapter);
  const durationMinutes = diffIn(adapter, event.end, event.start, 'minutes');

  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];

  const allDaySpanDays = getAllDaySpanDays(adapter, event);

  const scanStart = adapter.addDays(rangeStart, -(allDaySpanDays - 1));

  for (
    let day = adapter.startOfDay(scanStart);
    !adapter.isAfter(day, rangeEnd);
    day = adapter.addDays(day, 1)
  ) {
    // The series is still active on that day
    if (!endGuard(day)) {
      continue;
    }
    // the pattern matches on that day
    if (!matchesRecurrence(rule, day, adapter, event)) {
      continue;
    }

    const occurrenceStart = event.allDay
      ? adapter.startOfDay(day)
      : mergeDateAndTime(adapter, day, event.start);

    const occurrenceEnd = event.allDay
      ? adapter.endOfDay(adapter.addDays(occurrenceStart, allDaySpanDays - 1))
      : adapter.addMinutes(occurrenceStart, durationMinutes);

    const key = `${event.id}::${adapter.format(occurrenceStart, 'keyboardDate')}`;

    instances.push({
      ...event,
      key,
      start: occurrenceStart,
      end: occurrenceEnd,
    });
  }

  return instances;
}

export function buildEndGuard(
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  adapter: Adapter,
): (date: SchedulerValidDate) => boolean {
  const hasCount = typeof rule.count === 'number' && rule.count > 0;
  const hasUntil = !!rule.until;

  if (hasCount && hasUntil) {
    throw new Error('RRULE invalid: COUNT and UNTIL are mutually exclusive per RFC 5545.');
  }

  if (!hasCount && !hasUntil) {
    return () => true; // never ends
  }

  return (date) => {
    const dayStart = adapter.startOfDay(date);

    if (hasUntil) {
      const untilEndOfDay = adapter.endOfDay(rule.until!);
      if (adapter.isAfter(dayStart, untilEndOfDay)) {
        return false;
      }
    }

    if (hasCount) {
      const occurrencesSoFar = estimateOccurrencesUpTo(adapter, rule, seriesStart, dayStart);
      if (occurrencesSoFar > (rule.count as number)) {
        return false;
      }
    }

    return true;
  };
}

// Checks if the date matches the recurrence pattern, only looking forward (not before seriesStart)
export function matchesRecurrence(
  rule: RRuleSpec,
  date: SchedulerValidDate,
  adapter: Adapter,
  event: CalendarEvent,
): boolean {
  const interval = Math.max(1, rule.interval ?? 1);

  const seriesStartDay = adapter.startOfDay(event.start);
  const candidateDay = adapter.startOfDay(date);

  if (adapter.isBefore(candidateDay, seriesStartDay)) {
    return false;
  }

  switch (rule.freq) {
    case 'DAILY': {
      const daysDiff = diffIn(adapter, candidateDay, seriesStartDay, 'days');
      return daysDiff % interval === 0;
    }

    case 'WEEKLY': {
      const seriesWeek = adapter.startOfWeek(seriesStartDay);
      const dateWeek = adapter.startOfWeek(candidateDay);

      // If no BYDAY is provided in a WEEKLY rule, default to the weekday of DTSTART.
      const byDay = weeklyByDayCodes(rule.byDay, [
        NUM_TO_BYDAY[adapter.getDayOfWeek(seriesStartDay)],
      ]);

      const dateDowCode = NUM_TO_BYDAY[adapter.getDayOfWeek(candidateDay)];
      if (!byDay.includes(dateDowCode)) {
        return false;
      }

      const weeksDiff = diffIn(adapter, dateWeek, seriesWeek, 'weeks');
      return weeksDiff % interval === 0;
    }

    case 'MONTHLY': {
      const seriesMonth = adapter.startOfMonth(seriesStartDay);
      const dateMonth = adapter.startOfMonth(candidateDay);

      const monthsDiff = diffIn(adapter, dateMonth, seriesMonth, 'months');
      if (monthsDiff % interval !== 0) {
        return false;
      }

      // TODO (#19128): Add support for monthly recurrence modes (BYDAY rules)
      if (rule.byDay?.length) {
        // Only "same day-of-month" mode is supported right now.
        throw new Error(
          'MONTHLY supports only exact same date recurrence (day of month of DTSTART).',
        );
      }

      // If no BYMONTHDAY is provided in a MONTHLY rule, default to the day of month of DTSTART.
      const byMonthDay = rule.byMonthDay?.length
        ? rule.byMonthDay
        : [adapter.getDate(seriesStartDay)];

      return byMonthDay.includes(adapter.getDate(candidateDay));
    }

    case 'YEARLY': {
      const seriesYear = adapter.startOfYear(seriesStartDay);
      const dateYear = adapter.startOfYear(candidateDay);

      // Only exact "same month + same day" recurrence is supported.
      // Any use of BYMONTH, BYMONTHDAY, BYDAY, or multiple values is not allowed.
      if (rule.byMonth?.length || rule.byMonthDay?.length || rule.byDay?.length) {
        throw new Error('YEARLY supports only exact same date recurrence (month/day of DTSTART).');
      }

      const sameMonth = adapter.getMonth(candidateDay) === adapter.getMonth(seriesStartDay);
      const sameDay = adapter.getDate(candidateDay) === adapter.getDate(seriesStartDay);
      if (!sameMonth || !sameDay) {
        return false;
      }

      const yearsDiff = diffIn(adapter, dateYear, seriesYear, 'years');
      return yearsDiff % interval === 0;
    }

    default:
      return false;
  }
}

export function estimateOccurrencesUpTo(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  if (adapter.isBefore(adapter.startOfDay(date), adapter.startOfDay(seriesStart))) {
    return 0;
  }

  const interval = Math.max(1, rule.interval ?? 1);

  switch (rule.freq) {
    case 'DAILY': {
      const totalDays = diffIn(
        adapter,
        adapter.startOfDay(date),
        adapter.startOfDay(seriesStart),
        'days',
      );
      return Math.floor(totalDays / interval) + 1;
    }
    case 'WEEKLY':
      return countWeeklyOccurrencesUpToExact(adapter, rule, seriesStart, date);
    case 'MONTHLY':
      return countMonthlyOccurrencesUpToExact(adapter, rule, seriesStart, date);
    case 'YEARLY':
      return countYearlyOccurrencesUpToExact(adapter, rule, seriesStart, date);
    default:
      throw new Error(
        [
          `Unknown frequency: ${rule.freq}`,
          'Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".',
        ].join('\n'),
      );
  }
}

// Given a week start and a BYDAY code, return the exact occurrence date
function dayInWeek(adapter: Adapter, weekStart: SchedulerValidDate, code: ByDayCode) {
  const weekStartDow = adapter.getDayOfWeek(weekStart);
  const ruleDow = BYDAY_TO_NUM[code];
  const delta = (((ruleDow - weekStartDow) % 7) + 7) % 7;
  return adapter.startOfDay(adapter.addDays(weekStart, delta));
}

// Counts exact WEEKLY occurrences up to `date` (inclusive) respecting interval and BYDAY
export function countWeeklyOccurrencesUpToExact(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  const seriesStartDay = adapter.startOfDay(seriesStart);
  const targetDay = adapter.startOfDay(date);
  if (adapter.isBefore(targetDay, seriesStartDay)) {
    return 0;
  }

  const byDay = weeklyByDayCodes(rule.byDay, [NUM_TO_BYDAY[adapter.getDayOfWeek(seriesStart)]]);

  const interval = Math.max(1, rule.interval ?? 1);

  const seriesWeekStart = adapter.startOfWeek(seriesStart);
  const targetWeekStart = adapter.startOfWeek(targetDay);

  let count = 0;

  // Iterate weeks from start to target, stepping by `interval`
  for (
    let week = seriesWeekStart;
    !adapter.isAfter(week, targetWeekStart);
    week = adapter.addWeeks(week, interval)
  ) {
    // For the current week, check each weekday specified in BYDAY
    for (const code of byDay) {
      const occurrenceDay = dayInWeek(adapter, week, code);

      if (adapter.isBefore(occurrenceDay, seriesStartDay)) {
        continue;
      }
      if (adapter.isAfter(occurrenceDay, targetDay)) {
        continue;
      }

      count += 1;
    }
  }

  return count;
}

// Counts exact MONTHLY occurrences up to `date` (inclusive) respecting interval and monthly rules
export function countMonthlyOccurrencesUpToExact(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  const seriesStartMonth = adapter.startOfMonth(seriesStart);
  const targetMonth = adapter.startOfMonth(date);
  if (adapter.isBefore(targetMonth, seriesStartMonth)) {
    return 0;
  }

  const interval = Math.max(1, rule.interval ?? 1);
  const seriesStartDay = adapter.startOfDay(seriesStart);
  const targetDay = adapter.startOfDay(date);

  // TODO (#19128): Add support for monthly recurrence modes (BYDAY rules)
  if (rule.byDay?.length) {
    // Only "same day-of-month" mode is supported right now.
    // If a MONTHLY rule provides BYDAY (e.g., 2TU, -1FR), we intentionally IGNORE it for now.
  }

  // Guard: only a single BYMONTHDAY is supported for MONTHLY
  if ((rule.byMonthDay?.length ?? 0) > 1) {
    throw new Error('MONTHLY supports only a single BYMONTHDAY.');
  }

  // If no BYMONTHDAY is provided in a MONTHLY rule, default to the day of month of DTSTART.
  const dayOfMonth = rule.byMonthDay?.length ? rule.byMonthDay[0] : adapter.getDate(seriesStart);

  let count = 0;

  // Iterate months from start to target, stepping by `interval`
  for (
    let month = seriesStartMonth;
    !adapter.isAfter(month, targetMonth);
    month = adapter.addMonths(month, interval)
  ) {
    // if the day doesn't exist in this month, skip it
    const daysInMonth = adapter.getDaysInMonth(month);
    if (dayOfMonth > daysInMonth) {
      continue;
    }

    const candidate = adapter.startOfDay(adapter.setDate(month, dayOfMonth));
    if (adapter.isBefore(candidate, seriesStartDay)) {
      continue;
    }
    if (adapter.isAfter(candidate, targetDay)) {
      continue;
    }

    count += 1;
  }

  return count;
}

export function countYearlyOccurrencesUpToExact(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  const seriesStartYear = adapter.startOfYear(seriesStart);
  const targetYearStart = adapter.startOfYear(date);
  if (adapter.isBefore(targetYearStart, seriesStartYear)) {
    return 0;
  }

  const interval = Math.max(1, rule.interval ?? 1);
  const seriesStartDay = adapter.startOfDay(seriesStart);
  const targetDay = adapter.startOfDay(date);

  // Only the exact same calendar date is supported for YEARLY (month and day of DTSTART).
  // Any use of BYMONTH, BYMONTHDAY, or BYDAY is not allowed at the moment.
  if (rule.byMonth?.length || rule.byMonthDay?.length || rule.byDay?.length) {
    throw new Error('YEARLY supports only exact same date recurrence (month/day of DTSTART).');
  }

  const targetMonth = adapter.getMonth(seriesStart);
  const targetDayOfMonth = adapter.getDate(seriesStart);

  let count = 0;

  // Iterate years from the series start (inclusive) to the target year (inclusive),
  // stepping by `interval`.
  for (
    let year = seriesStartYear;
    !adapter.isAfter(year, targetYearStart);
    year = adapter.addYears(year, interval)
  ) {
    // Anchor to the target month in the current year
    const monthAnchor = adapter.setMonth(year, targetMonth);

    // Skip years where the requested day doesn't exist (e.g., Feb 29 on non-leap years)
    const daysInMonth = adapter.getDaysInMonth(monthAnchor);
    if (targetDayOfMonth > daysInMonth) {
      continue;
    }

    const candidate = adapter.startOfDay(adapter.setDate(monthAnchor, targetDayOfMonth));
    if (adapter.isBefore(candidate, seriesStartDay)) {
      continue;
    }
    if (adapter.isAfter(candidate, targetDay)) {
      continue;
    }

    count += 1;
  }

  return count;
}
