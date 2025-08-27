import { Adapter } from './adapter/types';
import {
  ByDayCode,
  ByDayValue,
  CalendarEvent,
  CalendarEventOccurrence,
  RRuleSpec,
  SchedulerValidDate,
} from '../models';
import { diffIn, mergeDateAndTime } from './date-utils';

/**
 * Build BYDAY<->number maps using a known ISO Monday (2025-01-06).
 * Day numbers come from adapter.getDayOfWeek(), so it respects the adapter’s locale/numbering.
 */
export function getByDayMaps(adapter: Adapter): {
  byDayToNum: Record<ByDayCode, number>;
  numToByDay: Record<number, ByDayCode>;
} {
  const baseMonday = adapter.date('2025-01-06T00:00:00Z'); // ISO Monday
  const byDayCodes: ByDayCode[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const byDayToNum = {} as Record<ByDayCode, number>;
  for (let i = 0; i < byDayCodes.length; i += 1) {
    const day = i === 0 ? baseMonday : adapter.addDays(baseMonday, i);
    byDayToNum[byDayCodes[i]] = adapter.getDayOfWeek(day);
  }

  const numToByDay: Record<number, ByDayCode> = {};
  for (const byDayCode of byDayCodes) {
    numToByDay[byDayToNum[byDayCode]] = byDayCode;
  }

  return { byDayToNum, numToByDay };
}

/**
 * Tokenizes a BYDAY value into { ord, code }.
 * @returns { ord: number|null, code: ByDayCode }
 * @throws if the value is invalid.
 */
export function tokenizeByDay(byDay: ByDayValue): { ord: number | null; code: ByDayCode } {
  const match = String(byDay).match(/^(-?[1-5])?(MO|TU|WE|TH|FR|SA|SU)$/);
  if (!match) {
    throw new Error('Event Calendar: invalid BYDAY value.');
  }
  return { ord: match[1] ? Number(match[1]) : null, code: match[2] as ByDayCode };
}

/**
 * Parses WEEKLY BYDAY expecting plain weekday codes (MO..SU).
 * If `ruleByDay` is empty, returns `fallback`.
 * @throws if any ordinal is present (e.g. 1MO, -1FR).
 */
export function parseWeeklyByDayPlain(
  ruleByDay: RRuleSpec['byDay'],
  fallback: ByDayCode[],
): ByDayCode[] {
  if (!ruleByDay?.length) {
    return fallback;
  }
  const parsed = ruleByDay.map(tokenizeByDay);
  if (parsed.some((item) => item.ord !== null)) {
    throw new Error(
      'Event Calendar: WEEKLY BYDAY must be plain MO..SU (no ordinals like 1MO, -1FR).',
    );
  }
  return parsed.map((item) => item.code);
}

/**
 * Parses MONTHLY BYDAY expecting one ordinal entry (e.g. 2TU, -1FR).
 * Returns normalized tokens with positive/negative ordinals.
 * @throws if BYDAY is missing, multiple, or missing ordinal.
 */
export function parseMonthlyByDayOrdinalSingle(ruleByDay: RRuleSpec['byDay']): {
  ord: number;
  code: ByDayCode;
} {
  if (!ruleByDay?.length || ruleByDay.length !== 1) {
    throw new Error(
      'Event Calendar: MONTHLY BYDAY must contain exactly one ordinal entry (e.g. 2TU or -1FR).',
    );
  }
  const { ord, code } = tokenizeByDay(ruleByDay[0]);
  if (ord == null) {
    throw new Error('Event Calendar: MONTHLY BYDAY must include an ordinal (e.g. 2TU or -1FR).');
  }
  return { ord, code };
}

export type RecurrencePresetKey = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function detectRecurrenceKeyFromRule(
  adapter: Adapter,
  rule: CalendarEvent['rrule'] | undefined,
  start: SchedulerValidDate,
): RecurrencePresetKey | 'custom' | null {
  if (!rule) {
    return null;
  }

  const interval = rule.interval ?? 1;
  const neverEnds = !rule.count && !rule.until;
  const hasSelectors = !!(rule.byDay?.length || rule.byMonthDay?.length || rule.byMonth?.length);
  const { numToByDay: numToCode } = getByDayMaps(adapter);

  switch (rule.freq) {
    case 'DAILY': {
      // Preset "Daily" => FREQ=DAILY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'daily' : 'custom';
    }

    case 'WEEKLY': {
      // Preset "Weekly" => FREQ=WEEKLY;INTERVAL=1;BYDAY=<weekday-of-start>; no COUNT/UNTIL;
      const startDowCode = numToCode[adapter.getDayOfWeek(start)];

      const byDay = rule.byDay ?? [];
      const matchesDefaultByDay =
        byDay.length === 0 || (byDay.length === 1 && byDay[0] === startDowCode);
      const isPresetWeekly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByDay &&
        !(rule.byMonthDay?.length || rule.byMonth?.length);

      return isPresetWeekly ? 'weekly' : 'custom';
    }

    case 'MONTHLY': {
      // Preset "Monthly" => FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=<start-day>; no COUNT/UNTIL;
      const day = adapter.getDate(start);
      const byMonthDay = rule.byMonthDay ?? [];
      const matchesDefaultByMonthDay =
        byMonthDay.length === 0 || (byMonthDay.length === 1 && byMonthDay[0] === day);
      const isPresetMonthly =
        interval === 1 &&
        neverEnds &&
        matchesDefaultByMonthDay &&
        !(rule.byDay?.length || rule.byMonth?.length);

      return isPresetMonthly ? 'monthly' : 'custom';
    }

    case 'YEARLY': {
      // Preset "Yearly" => FREQ=YEARLY;INTERVAL=1; no COUNT/UNTIL;
      return interval === 1 && neverEnds && !hasSelectors ? 'yearly' : 'custom';
    }

    default:
      return 'custom';
  }
}

export function buildRecurrencePresets(
  adapter: Adapter,
  start: SchedulerValidDate,
): Record<RecurrencePresetKey, RRuleSpec> {
  const { numToByDay: numToCode } = getByDayMaps(adapter);
  const startDowCode = numToCode[adapter.getDayOfWeek(start)];
  const startDayOfMonth = adapter.getDate(start);

  return {
    daily: {
      freq: 'DAILY',
      interval: 1,
    },
    weekly: {
      freq: 'WEEKLY',
      interval: 1,
      byDay: [startDowCode],
    },
    monthly: {
      freq: 'MONTHLY',
      interval: 1,
      byMonthDay: [startDayOfMonth],
    },
    yearly: {
      freq: 'YEARLY',
      interval: 1,
    },
  };
}

/**
 *  Inclusive span (in days) for all-day events.
 *  @returns At least 1, start==end yields 1.
 */
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

/**
 *  Expands a recurring `event` into concrete occurrences within the visible days.
 *  Honors COUNT/UNTIL via `buildEndGuard` and date pattern via `matchesRecurrence`.
 *  Preserves timed duration; for all-day spans, expands to cover the full multi-day block.
 *  @returns Sorted list (by start) of concrete occurrences.
 */
export function getRecurringEventOccurrencesForVisibleDays(
  event: CalendarEvent,
  days: SchedulerValidDate[],
  adapter: Adapter,
): CalendarEventOccurrence[] {
  const rule = event.rrule!;
  const instances: CalendarEventOccurrence[] = [];

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

/**
 *  Builds a predicate that says whether the series is still active on a given date.
 *  Supports either COUNT or UNTIL (mutually exclusive, UNTIL is inclusive of that day).
 *  COUNT uses `estimateOccurrencesUpTo` (inclusive) to stop after the Nth occurrence.
 */
export function buildEndGuard(
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  adapter: Adapter,
): (date: SchedulerValidDate) => boolean {
  const hasCount = typeof rule.count === 'number' && rule.count > 0;
  const hasUntil = !!rule.until;

  if (hasCount && hasUntil) {
    throw new Error(
      'Event Calendar: RRULE invalid, COUNT and UNTIL are mutually exclusive per RFC 5545.',
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
      const occurrencesSoFar = estimateOccurrencesUpTo(adapter, rule, seriesStart, dayStart);
      if (occurrencesSoFar > (rule.count as number)) {
        return false;
      }
    }

    return true;
  };
}

/**
 * Returns the startOfDay for the Nth weekday in a given month.
 * ordinal > 0 → Nth from the start (1..5). ordinal < 0 → Nth from the end (-1 = last).
 * If that occurrence doesn't exist in the month, returns null.
 */
export function nthWeekdayOfMonth(
  adapter: Adapter,
  monthStart: SchedulerValidDate,
  weekdayCode: ByDayCode,
  ordinal: number,
): SchedulerValidDate | null {
  const { byDayToNum } = getByDayMaps(adapter);
  const targetWeekdayNumber = byDayToNum[weekdayCode];

  const totalDaysInMonth = adapter.getDaysInMonth(monthStart);

  // Path A — Nth occurrence from the start of the month (ordinal > 0)
  if (ordinal > 0) {
    const firstDayWeekdayNumber = adapter.getDayOfWeek(monthStart);
    const offsetToFirstTargetWeekday =
      (((targetWeekdayNumber - firstDayWeekdayNumber) % 7) + 7) % 7;
    const firstTargetWeekdayInMonth = adapter.addDays(monthStart, offsetToFirstTargetWeekday);
    // Jump (ordinal - 1) whole weeks forward
    const nthOccurrenceDate = adapter.addDays(firstTargetWeekdayInMonth, 7 * (ordinal - 1));

    // If this is not in the same month, return null
    if (adapter.getMonth(nthOccurrenceDate) !== adapter.getMonth(monthStart)) {
      return null;
    }
    return adapter.startOfDay(nthOccurrenceDate);
  }

  // Path B — Nth occurrence from the end of the month (ordinal < 0)
  const lastDayOfMonth = adapter.startOfDay(adapter.setDate(monthStart, totalDaysInMonth));
  const lastDayWeekdayNumber = adapter.getDayOfWeek(lastDayOfMonth);
  const offsetBackToTargetWeekday = (((lastDayWeekdayNumber - targetWeekdayNumber) % 7) + 7) % 7;
  const lastTargetWeekdayInMonth = adapter.addDays(lastDayOfMonth, -offsetBackToTargetWeekday);
  const weeksToMoveBack = Math.abs(ordinal) - 1;
  const nthFromEndOccurrenceDate = adapter.addDays(lastTargetWeekdayInMonth, -7 * weeksToMoveBack);

  // If this is not in the same month, return null
  if (adapter.getMonth(nthFromEndOccurrenceDate) !== adapter.getMonth(monthStart)) {
    return null;
  }
  return adapter.startOfDay(nthFromEndOccurrenceDate);
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
      const { numToByDay: numToCode } = getByDayMaps(adapter);

      // If no BYDAY is provided in a WEEKLY rule, default to the weekday of DTSTART.
      const byDay = parseWeeklyByDayPlain(rule.byDay, [
        numToCode[adapter.getDayOfWeek(seriesStartDay)],
      ]);

      const dateDowCode = numToCode[adapter.getDayOfWeek(candidateDay)];
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

      // If BYDAY provided, support ordinal BYDAY (Nth/last).
      if (rule.byDay?.length) {
        if (rule.byMonthDay?.length) {
          throw new Error(
            'Event Calendar: For MONTHLY use either BYDAY (ordinal) or BYMONTHDAY, not both.',
          );
        }

        const { ord, code } = parseMonthlyByDayOrdinalSingle(rule.byDay);
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
          'Event Calendar: YEARLY supports only exact same date recurrence (month/day of DTSTART).',
        );
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

/**
 *  Estimates how many occurrences exist from DTSTART up to `date` (inclusive).
 *  Used to enforce COUNT. Delegates to exact counters for WEEKLY/MONTHLY/YEARLY.
 *  Returns 0 if `date` is before DTSTART (day precision).
 */
export function estimateOccurrencesUpTo(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  if (adapter.isBeforeDay(date, seriesStart)) {
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
          `Event Calendar: Unknown frequency ${rule.freq}`,
          'Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".',
        ].join('\n'),
      );
  }
}

/**
 *  Given a week start and a BYDAY code, returns the exact date in that week.
 */
function dayInWeek(adapter: Adapter, weekStart: SchedulerValidDate, code: ByDayCode) {
  const { byDayToNum: codeToNum } = getByDayMaps(adapter);
  const weekStartDow = adapter.getDayOfWeek(weekStart);
  const ruleDow = codeToNum[code];
  const delta = (((ruleDow - weekStartDow) % 7) + 7) % 7;
  return adapter.startOfDay(adapter.addDays(weekStart, delta));
}

/**
 *  Exact WEEKLY occurrence count up to `date` (inclusive).
 *  Iterates weeks by `interval`, checking each BYDAY. Skips days before DTSTART.
 *  BYDAY defaults to DTSTART weekday if omitted.
 */
export function countWeeklyOccurrencesUpToExact(
  adapter: Adapter,
  rule: RRuleSpec,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  if (adapter.isBeforeDay(date, seriesStart)) {
    return 0;
  }

  const { numToByDay: numToCode } = getByDayMaps(adapter);
  const byDay = parseWeeklyByDayPlain(rule.byDay, [numToCode[adapter.getDayOfWeek(seriesStart)]]);

  const interval = Math.max(1, rule.interval ?? 1);

  const seriesWeekStart = adapter.startOfWeek(seriesStart);
  const targetWeekStart = adapter.startOfWeek(date);

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

      if (adapter.isBeforeDay(occurrenceDay, seriesStart)) {
        continue;
      }
      if (adapter.isAfterDay(occurrenceDay, date)) {
        continue;
      }

      count += 1;
    }
  }

  return count;
}

/**
 * Counts MONTHLY occurrences up to `date` (inclusive).
 * Modes: BYDAY with ordinals (e.g. 2TU, -1FR; multiple allowed) OR single BYMONTHDAY (default = DTSTART day).
 * Skips months without a match. Steps by `interval`, respecting series start and target boundaries.
 * @throws If BYDAY is combined with BYMONTHDAY, or BYMONTHDAY has >1 value.
 */
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

  // Path A: BYDAY with ordinals (e.g. 2TU, -1FR). Not mixed with BYMONTHDAY.
  if (rule.byDay?.length) {
    if (rule.byMonthDay?.length) {
      throw new Error(
        'Event Calendar: MONTHLY use either BYDAY (ordinal) or BYMONTHDAY, not both.',
      );
    }

    const { ord, code } = parseMonthlyByDayOrdinalSingle(rule.byDay);

    let count = 0;
    for (
      let month = seriesStartMonth;
      !adapter.isAfter(month, targetMonth);
      month = adapter.addMonths(month, interval)
    ) {
      const occurrenceDate = nthWeekdayOfMonth(adapter, month, code, ord);
      if (!occurrenceDate) {
        continue;
      }

      if (adapter.isBeforeDay(occurrenceDate, seriesStart)) {
        continue;
      }
      if (adapter.isAfterDay(occurrenceDate, date)) {
        continue;
      }

      count += 1;
    }
    return count;
  }

  // Path B: BYMONTHDAY (single mode, default to DTSTART day)
  if ((rule.byMonthDay?.length ?? 0) > 1) {
    throw new Error('Event Calendar: MONTHLY supports only a single BYMONTHDAY.');
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
    if (adapter.isBeforeDay(candidate, seriesStart)) {
      continue;
    }
    if (adapter.isAfterDay(candidate, date)) {
      continue;
    }

    count += 1;
  }

  return count;
}

/**
 *  Exact YEARLY occurrence count up to `date` (inclusive).
 *  Only same month/day as DTSTART, skips non-leap years for Feb 29.
 *  Iterates years by `interval`, bounded by series start and target year.
 *  @throws If BYMONTH/DAY/BYDAY are present (unsupported for YEARLY at the moment).
 */
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

  // Only the exact same calendar date is supported for YEARLY (month and day of DTSTART).
  // Any use of BYMONTH, BYMONTHDAY, or BYDAY is not allowed at the moment.
  if (rule.byMonth?.length || rule.byMonthDay?.length || rule.byDay?.length) {
    throw new Error(
      'Event Calendar: YEARLY supports only exact same date recurrence (month/day of DTSTART).',
    );
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
    if (adapter.isBeforeDay(candidate, seriesStart)) {
      continue;
    }
    if (adapter.isAfterDay(candidate, date)) {
      continue;
    }

    count += 1;
  }

  return count;
}
