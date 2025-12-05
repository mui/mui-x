import { processDate } from '../../process-date';
import {
  RecurringEventRecurrenceRule,
  SchedulerEventOccurrence,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
} from '../../models';
import { Adapter } from '../../use-adapter';
import { getDateKey, getOccurrenceEnd, mergeDateAndTime } from '../date-utils';
import {
  getRemainingOccurrences,
  getEventDurationInDays,
  getWeekDayCode,
  nthWeekdayOfMonth,
  parsesByDayForMonthlyFrequency,
  parsesByDayForWeeklyFrequency,
} from './internal-utils';

/**
 *  Expands a recurring `event` into concrete occurrences within the visible days.
 *  Honors COUNT/UNTIL via `buildEndGuard` and date pattern via `matchesRecurrence`.
 *  Preserves timed duration; for all-day spans, expands to cover the full multi-day block.
 *  @returns Sorted list (by start) of concrete occurrences.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: SchedulerProcessedEvent,
  start: TemporalSupportedObject,
  end: TemporalSupportedObject,
  adapter: Adapter,
): SchedulerEventOccurrence[] {
  const rule = event.rrule!;
  const occurrences: SchedulerEventOccurrence[] = [];
  const endGuard = buildEndGuard(rule, event.start.value, adapter);
  const eventDuration = getEventDurationInDays(adapter, event);
  const scanStart = adapter.addDays(start, -(eventDuration - 1));

  for (
    let day = adapter.startOfDay(scanStart);
    !adapter.isAfter(day, end);
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

    const occurrenceStart = mergeDateAndTime(adapter, day, event.start.value);
    const occurrenceEnd = getOccurrenceEnd({ adapter, event, occurrenceStart });

    const key = `${event.id}::${getDateKey(occurrenceStart, adapter)}`;

    if (event.exDates?.some((exDate) => adapter.isSameDay(exDate, occurrenceStart))) {
      continue;
    }

    occurrences.push({
      ...event,
      key,
      start: processDate(occurrenceStart, adapter),
      end: processDate(occurrenceEnd, adapter),
    });
  }

  return occurrences;
}

/**
 *  Builds a predicate that says whether the series is still active on a given date.
 *  Supports either COUNT or UNTIL (mutually exclusive, UNTIL is inclusive of that day).
 *  COUNT uses `getRemainingOccurrences` (inclusive) to stop after the Nth occurrence.
 */
export function buildEndGuard(
  rule: RecurringEventRecurrenceRule,
  seriesStart: TemporalSupportedObject,
  adapter: Adapter,
): (date: TemporalSupportedObject) => boolean {
  const hasCount = typeof rule.count === 'number' && rule.count > 0;
  const hasUntil = !!rule.until;

  if (hasCount && hasUntil) {
    throw new Error(
      'Scheduler: The recurring rule cannot have both the count and until properties.',
    );
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
      const remainingOccurrences = getRemainingOccurrences(
        adapter,
        rule,
        seriesStart,
        dayStart,
        rule.count as number,
      );
      if (remainingOccurrences < 0) {
        return false;
      }
    }

    return true;
  };
}

/**
 *  Tests whether `date` matches the RRULE (never matches before DTSTART).
 *  DAILY: day-diff % interval === 0.
 *  WEEKLY: week-diff % interval === 0 and weekday in BYDAY (defaults to DTSTART weekday).
 *  MONTHLY: supports only BYMONTHDAY (or defaults to DTSTART day); BYDAY is not yet supported.
 *  YEARLY: same month/day as DTSTART; BYxxx selectors are not allowed here.
 *  @throws For unsupported YEARLY or MONTHLY selector combos.
 */
export function matchesRecurrence(
  rule: RecurringEventRecurrenceRule,
  date: TemporalSupportedObject,
  adapter: Adapter,
  event: SchedulerProcessedEvent,
): boolean {
  const interval = Math.max(1, rule.interval ?? 1);
  const seriesStartDay = adapter.startOfDay(event.start.value);
  const candidateDay = adapter.startOfDay(date);

  if (adapter.isBefore(candidateDay, seriesStartDay)) {
    return false;
  }

  switch (rule.freq) {
    case 'DAILY': {
      const daysDiff = adapter.differenceInDays(candidateDay, seriesStartDay);
      return daysDiff % interval === 0;
    }

    case 'WEEKLY': {
      const seriesWeek = adapter.startOfWeek(seriesStartDay);
      const dateWeek = adapter.startOfWeek(candidateDay);

      // If no BYDAY is provided in a WEEKLY rule, default to the weekday of DTSTART.
      const weekDayCode = parsesByDayForWeeklyFrequency(rule.byDay) ?? [
        getWeekDayCode(adapter, seriesStartDay),
      ];

      const dateDowCode = getWeekDayCode(adapter, candidateDay);
      if (!weekDayCode.includes(dateDowCode)) {
        return false;
      }

      const weeksDiff = adapter.differenceInWeeks(dateWeek, seriesWeek);
      return weeksDiff % interval === 0;
    }

    case 'MONTHLY': {
      const seriesMonth = adapter.startOfMonth(seriesStartDay);
      const dateMonth = adapter.startOfMonth(candidateDay);

      const monthsDiff = adapter.differenceInMonths(dateMonth, seriesMonth);
      if (monthsDiff % interval !== 0) {
        return false;
      }

      // If BYDAY provided, support ordinal BYDAY (Nth/last).
      if (rule.byDay?.length) {
        if (rule.byMonthDay?.length) {
          throw new Error(
            'Scheduler: The monthly recurrences cannot have both the byDay and the byMonthDay properties.',
          );
        }

        const { ord, code } = parsesByDayForMonthlyFrequency(rule.byDay);
        const occurrenceDate = nthWeekdayOfMonth(adapter, dateMonth, code, ord);
        if (occurrenceDate && adapter.isSameDay(occurrenceDate, candidateDay)) {
          return true;
        }
        return false;
      }

      // Fallback: exact day-of-month (BYMONTHDAY) or default to DTSTART day
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
        throw new Error(
          'Scheduler: The yearly recurrences only support exact same date recurrence (month/day of DTSTART).',
        );
      }

      const sameMonth = adapter.getMonth(candidateDay) === adapter.getMonth(seriesStartDay);
      const sameDay = adapter.getDate(candidateDay) === adapter.getDate(seriesStartDay);
      if (!sameMonth || !sameDay) {
        return false;
      }

      const yearsDiff = adapter.differenceInYears(dateYear, seriesYear);
      return yearsDiff % interval === 0;
    }

    default:
      return false;
  }
}
