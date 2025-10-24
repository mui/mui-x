import { Adapter } from '../use-adapter/useAdapter.types';
import {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  CalendarEvent,
  CalendarEventOccurrence,
  CalendarEventUpdatedProperties,
  RecurringEventRecurrenceRule,
  SchedulerValidDate,
} from '../models';
import { mergeDateAndTime, getDateKey } from './date-utils';
import { diffIn } from '../use-adapter';
import { UpdateEventsParameters } from './SchedulerStore';

/**
 * The week day codes for all 7 days of the week.
 */
export const NOT_LOCALIZED_WEEK_DAYS: RecurringEventWeekDayCode[] = [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
];

const mondayMap = new WeakMap<Adapter, SchedulerValidDate>();
/**
 * Returns the week day number (1..7) of Monday for a given adapter.
 */
function getMondayWeekDayNumber(adapter: Adapter) {
  let monday: SchedulerValidDate;
  const mondayFromCache = mondayMap.get(adapter);
  if (mondayFromCache != null) {
    monday = mondayFromCache;
  } else {
    monday = adapter.date('2025-01-06T00:00:00Z', 'utc'); // ISO Monday
    mondayMap.set(adapter, monday);
  }

  return adapter.getDayOfWeek(monday);
}

/**
 * Returns the week day code (MO..SU) for a given date.
 * Day numbers come from adapter.getDayOfWeek(), so it respects the adapter’s locale numbering.
 */
export function getWeekDayCode(
  adapter: Adapter,
  date: SchedulerValidDate,
): RecurringEventWeekDayCode {
  const dayOfWeek = adapter.getDayOfWeek(date);
  const mondayWeekDayNumber = getMondayWeekDayNumber(adapter);
  return NOT_LOCALIZED_WEEK_DAYS[(dayOfWeek - mondayWeekDayNumber + 7) % 7];
}

/**
 * Returns the week day number (1..7) for a given week day code (MO..SU).
 * Day numbers come from adapter.getDayOfWeek(), so it respects the adapter’s locale numbering.
 */
export function getWeekDayNumberFromCode(
  adapter: Adapter,
  code: RecurringEventWeekDayCode,
): number {
  const mondayWeekDayNumber = getMondayWeekDayNumber(adapter);
  const indexOfCode = NOT_LOCALIZED_WEEK_DAYS.indexOf(code);
  return ((indexOfCode + mondayWeekDayNumber - 1) % 7) + 1;
}

/**
 * Tokenizes a byDay value into { ord, code }.
 * @returns { ord: number | null, code: RecurringEventWeekDayCode }
 * @throws if the value is invalid.
 */
export function tokenizeByDay(byDay: RecurringEventByDayValue): {
  ord: number | null;
  code: RecurringEventWeekDayCode;
} {
  const match = String(byDay).match(/^(-?[1-5])?(MO|TU|WE|TH|FR|SA|SU)$/);
  if (!match) {
    throw new Error(`Scheduler: ${byDay} is not a valid value for the byDay property.`);
  }
  return { ord: match[1] ? Number(match[1]) : null, code: match[2] as RecurringEventWeekDayCode };
}

/**
 * Parses the byDay property for a weekly frequency.
 * It only accepts weekday codes (MO..SU) without ordinal.
 * If `ruleByDay` is empty, returns `fallback`.
 * @throws if any ordinal is present (e.g. 1MO, -1FR).
 */
export function parsesByDayForWeeklyFrequency(
  ruleByDay: RecurringEventRecurrenceRule['byDay'] | undefined,
): RecurringEventWeekDayCode[] | null {
  if (!ruleByDay?.length) {
    return null;
  }
  const parsed = ruleByDay.map(tokenizeByDay);
  if (parsed.some((item) => item.ord !== null)) {
    throw new Error(
      'Scheduler: The byDay property must be a plain MO..SU (no ordinals like 1MO, -1FR) when used with a weekly frequency.',
    );
  }
  return parsed.map((item) => item.code);
}

/**
 * Parses the byDay property for a monthly frequency.
 * Expects a single ordinal entry (e.g. 2TU, -1FR).
 * Returns normalized tokens with positive/negative ordinals.
 * @throws if byDay property is missing, multiple, or missing ordinal.
 */
export function parsesByDayForMonthlyFrequency(ruleByDay: RecurringEventByDayValue[]): {
  ord: number;
  code: RecurringEventWeekDayCode;
} {
  const { ord, code } =
    ruleByDay.length === 1 ? tokenizeByDay(ruleByDay[0]) : { ord: null, code: null };

  if (ord == null) {
    throw new Error(
      'Scheduler: The byDay property must contain contain a single element with an ordinal (e.g. ["2TU"] or ["-1FR"]).',
    );
  }

  return { ord, code };
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
  start: SchedulerValidDate,
  end: SchedulerValidDate,
  adapter: Adapter,
): CalendarEventOccurrence[] {
  const rule = event.rrule!;
  const occurrences: CalendarEventOccurrence[] = [];

  const endGuard = buildEndGuard(rule, event.start, adapter);
  const durationMinutes = diffIn(adapter, event.end, event.start, 'minutes');

  const allDaySpanDays = getAllDaySpanDays(adapter, event);
  const scanStart = adapter.addDays(start, -(allDaySpanDays - 1));

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

    const occurrenceStart = event.allDay
      ? adapter.startOfDay(day)
      : mergeDateAndTime(adapter, day, event.start);

    const occurrenceEnd = event.allDay
      ? adapter.endOfDay(adapter.addDays(occurrenceStart, allDaySpanDays - 1))
      : adapter.addMinutes(occurrenceStart, durationMinutes);

    const key = `${event.id}::${getDateKey(occurrenceStart, adapter)}`;

    if (event.exDates?.some((exDate) => adapter.isSameDay(exDate, occurrenceStart))) {
      continue;
    }

    occurrences.push({
      ...event,
      key,
      start: occurrenceStart,
      end: occurrenceEnd,
    });
  }

  return occurrences;
}

/**
 *  Builds a predicate that says whether the series is still active on a given date.
 *  Supports either COUNT or UNTIL (mutually exclusive, UNTIL is inclusive of that day).
 *  COUNT uses `estimateOccurrencesUpTo` (inclusive) to stop after the Nth occurrence.
 */
export function buildEndGuard(
  rule: RecurringEventRecurrenceRule,
  seriesStart: SchedulerValidDate,
  adapter: Adapter,
): (date: SchedulerValidDate) => boolean {
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
  weekdayCode: RecurringEventWeekDayCode,
  ordinal: number,
): SchedulerValidDate | null {
  const targetWeekdayNumber = getWeekDayNumberFromCode(adapter, weekdayCode);
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
  rule: RecurringEventRecurrenceRule,
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
      const weekDayCode = parsesByDayForWeeklyFrequency(rule.byDay) ?? [
        getWeekDayCode(adapter, seriesStartDay),
      ];

      const dateDowCode = getWeekDayCode(adapter, candidateDay);
      if (!weekDayCode.includes(dateDowCode)) {
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
  rule: RecurringEventRecurrenceRule,
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
          `Scheduler: Unknown frequency ${rule.freq}.`,
          'Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".',
        ].join('\n'),
      );
  }
}

/**
 *  Given a week start and a BYDAY code, returns the exact date in that week.
 */
function dayInWeek(
  adapter: Adapter,
  weekStart: SchedulerValidDate,
  code: RecurringEventWeekDayCode,
) {
  const weekStartDow = adapter.getDayOfWeek(weekStart);
  const ruleDow = getWeekDayNumberFromCode(adapter, code);
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
  rule: RecurringEventRecurrenceRule,
  seriesStart: SchedulerValidDate,
  date: SchedulerValidDate,
): number {
  if (adapter.isBeforeDay(date, seriesStart)) {
    return 0;
  }

  const byDay = parsesByDayForWeeklyFrequency(rule.byDay) ?? [getWeekDayCode(adapter, seriesStart)];

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
  rule: RecurringEventRecurrenceRule,
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
        'Scheduler: The monthly recurrences cannot have both the byDay and the byMonthDay properties.',
      );
    }

    const { ord, code } = parsesByDayForMonthlyFrequency(rule.byDay);

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
    throw new Error(
      "Scheduler: The monthly recurrences don't support byMonthDay with multiple elements.",
    );
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
  rule: RecurringEventRecurrenceRule,
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
      'Scheduler: The yearly recurrences must have either the byMonth, the byMonthDay or the byDay property defined.',
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

/**
 * Computes the ordinal for a MONTHLY BYDAY rule for a given date.
 * @returns {number} - The ordinal: -1 for last, otherwise 1..5.
 */
export function computeMonthlyOrdinal(adapter: Adapter, date: SchedulerValidDate): number {
  const monthStart = adapter.startOfMonth(date);
  const code = getWeekDayCode(adapter, date);

  // Is it the last same-weekday of the month? (-1)
  const lastSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, -1)!;
  if (adapter.isSameDay(adapter.startOfDay(date), lastSameWeekday)) {
    return -1;
  }

  // First same-weekday of the month (1..5)
  const firstSameWeekday = nthWeekdayOfMonth(adapter, monthStart, code, 1)!;
  const daysDiff = diffIn(adapter, adapter.startOfDay(date), firstSameWeekday, 'days');
  return Math.floor(daysDiff / 7) + 1;
}

/**
 * Realigns a WEEKLY BYDAY pattern when splitting “this and following”.
 * Swaps the weekday of the edited occurrence (oldRefDay) with the weekday of the new
 * series start (newStart), preserving the rest of the pattern and avoiding duplicates.
 * @returns {RecurringEventByDayValue[]} - The realigned BYDAY list (deduplicated).
 */
export function realignWeeklyByDay(
  adapter: Adapter,
  weekDayCodes: RecurringEventWeekDayCode[],
  oldRefDay: SchedulerValidDate,
  newStart: SchedulerValidDate,
): RecurringEventWeekDayCode[] {
  const oldCode = getWeekDayCode(adapter, oldRefDay);
  const newCode = getWeekDayCode(adapter, newStart);

  if (oldCode === newCode) {
    return weekDayCodes;
  }

  const weekDayCodesSet = new Set(weekDayCodes);
  const mondayWeekDayNumber = getMondayWeekDayNumber(adapter);

  const newWeekDayCodes: RecurringEventWeekDayCode[] = [];
  for (let i = 0; i < NOT_LOCALIZED_WEEK_DAYS.length; i += 1) {
    const code = NOT_LOCALIZED_WEEK_DAYS[(i + mondayWeekDayNumber - 1) % 7];

    let shouldAddCode: boolean;
    // Only add the newCode if the oldCode was present
    if (code === newCode && weekDayCodesSet.has(oldCode)) {
      shouldAddCode = true;
    }
    // Only add other codes if they were present originally and are not the oldCode
    else if (weekDayCodesSet.has(code) && code !== oldCode) {
      shouldAddCode = true;
    } else {
      shouldAddCode = false;
    }

    if (shouldAddCode) {
      newWeekDayCodes.push(code);
    }
  }

  return newWeekDayCodes;
}

/**
 * Decides the RRULE for the split (new) segment when editing "this and following".
 *
 * Rules:
 * - If user provided changes.rrule → use it as-is (preserve COUNT/UNTIL).
 * - If changes.rrule is explicitly undefined → non-recurring one-off.
 * - If changes.rrule is omitted → inherit pattern and recompute boundaries:
 *   * WEEKLY: if `changes.start` is provided, realign BYDAY by swapping the weekday of the
 *     edited occurrence with the weekday of the new start (dedupe if needed).
 *   * MONTHLY:
 *       - If BYMONTHDAY is present: set it to the day of `changes.start`.
 *       - If BYDAY (ordinal) is present: recompute `{ord}{code}` using `computeMonthlyOrdinal`
 *         and the weekday of `changes.start`.
 *   * Boundaries:
 *       - If original had COUNT: set COUNT = remaining occurrences from the split day.
 *       - If original had UNTIL: keep the same UNTIL.
 */
export function decideSplitRRule(
  adapter: Adapter,
  originalRule: RecurringEventRecurrenceRule,
  originalSeriesStart: SchedulerValidDate,
  splitStart: SchedulerValidDate,
  changes: Partial<CalendarEvent>,
): RecurringEventRecurrenceRule | undefined {
  // Normalize base pattern (drop COUNT/UNTIL)
  const { count, until, ...baseRule } = originalRule;

  // Detect whether user touched rrule at all
  const hasRRuleProp = Object.prototype.hasOwnProperty.call(changes, 'rrule');
  const changesRRule = changes.rrule;

  // Case A — user provided a new RRULE → respect it (including COUNT/UNTIL)
  if (hasRRuleProp && changesRRule) {
    return changesRRule;
  }

  // Case B — user explicitly removed recurrence → one-off
  if (hasRRuleProp && !changesRRule) {
    return undefined;
  }

  // Case C — user did not touch RRULE → inherit pattern and recompute boundaries
  let realignedRule: Omit<RecurringEventRecurrenceRule, 'count' | 'until'> = { ...baseRule };
  const splitDayStart = adapter.startOfDay(splitStart);

  // Freq WEEKLY: realign BYDAY, swap the old weekday for the new one while preserving the rest of the weekly pattern.
  if (originalRule.freq === 'WEEKLY' && baseRule.byDay?.length && changes.start) {
    realignedRule = {
      ...realignedRule,
      byDay: realignWeeklyByDay(
        adapter,
        baseRule.byDay as RecurringEventWeekDayCode[],
        adapter.startOfDay(splitStart),
        changes.start,
      ),
    };
  }
  // Freq MONTHLY realignment
  if (originalRule.freq === 'MONTHLY' && changes.start) {
    // A) BYMONTHDAY → set to the new calendar day
    if (baseRule.byMonthDay?.length) {
      realignedRule = { ...realignedRule, byMonthDay: [adapter.getDate(changes.start)] };
    }

    // B) Ordinal BYDAY → recompute ordinal + weekday for the new date
    if (baseRule.byDay?.length) {
      const code = getWeekDayCode(adapter, changes.start);
      const ord = computeMonthlyOrdinal(adapter, changes.start);
      realignedRule = { ...realignedRule, byDay: [`${ord}${code}` as RecurringEventByDayValue] };
    }
  }

  // Recalculate COUNT: original minus prior occurrences.
  if (originalRule.count) {
    const dayBefore = adapter.addDays(splitDayStart, -1);
    const occurrencesBeforeSplit = estimateOccurrencesUpTo(
      adapter,
      originalRule,
      originalSeriesStart,
      dayBefore,
    );
    const remaining = Math.max(0, originalRule.count - occurrencesBeforeSplit);
    return remaining > 0 ? { ...realignedRule, count: remaining } : undefined;
  }

  if (originalRule.until) {
    return { ...realignedRule, until: originalRule.until };
  }

  return { ...realignedRule };
}

/**
 * Applies a "this and following" update to a recurring series by splitting it into:
 * - the original series truncated up to the day before the edited occurrence, and
 * - a new series starting at the edited occurrence with the requested changes.
 * @returns The updated list of events with the split applied.
 */
export function applyRecurringUpdateFollowing(
  adapter: Adapter,
  originalEvent: CalendarEvent,
  occurrenceStart: SchedulerValidDate,
  changes: CalendarEventUpdatedProperties,
): UpdateEventsParameters {
  const newStart = changes.start ?? originalEvent.start;

  // 1) Old series: truncate rule to end the day before the edited occurrence
  const occurrenceDayStart = adapter.startOfDay(occurrenceStart);
  const untilDate = adapter.addDays(occurrenceDayStart, -1);

  const originalRule = originalEvent.rrule as RecurringEventRecurrenceRule;
  const { count, until, ...baseRule } = originalRule;

  // 2) New event: apply changes, decide RRULE for the new series
  const newRRule = decideSplitRRule(
    adapter,
    originalRule,
    originalEvent.start,
    occurrenceStart,
    changes,
  );
  const newEventId = `${originalEvent.id}::${getDateKey(newStart, adapter)}`;

  const newEvent: CalendarEvent = {
    ...originalEvent,
    ...changes,
    id: newEventId,
    rrule: newRRule,
    extractedFromId: originalEvent.id,
  };

  // 3) If UNTIL falls before DTSTART, the original series has no remaining occurrences -> drop it, otherwise truncate it.
  const shouldDropOldSeries = adapter.isBefore(
    adapter.endOfDay(untilDate),
    adapter.startOfDay(originalEvent.start),
  );

  if (shouldDropOldSeries) {
    return { created: [newEvent], deleted: [originalEvent.id] };
  }

  return {
    created: [newEvent],
    updated: [{ id: originalEvent.id, rrule: { ...baseRule, until: untilDate } }],
  };
}

/**
 * Adjusts a recurring event's RRULE when applying an "all" update that changes the weekday.
 *
 * Rules:
 * - WEEKLY: realign BYDAY by swapping the weekday of the edited occurrence
 *   with the weekday of the destination.
 * - MONTHLY:
 *   - If BYMONTHDAY is used → set it to the new start date's day of month.
 *   - If BYDAY (ordinal) is used → recompute the ordinal (e.g. 2TU → 3WE) based on the new start.
 * @returns The adjusted RRULE object, or the original rrule if no change is needed.
 */
export function adjustRRuleForAllMove(
  adapter: Adapter,
  rrule: RecurringEventRecurrenceRule,
  occurrenceStart: SchedulerValidDate,
  newStart: SchedulerValidDate,
): RecurringEventRecurrenceRule {
  let nextRRule: RecurringEventRecurrenceRule = { ...rrule };

  if (rrule.freq === 'WEEKLY') {
    const normalized = parsesByDayForWeeklyFrequency(rrule.byDay) ?? [
      getWeekDayCode(adapter, occurrenceStart),
    ];

    const swapped = realignWeeklyByDay(adapter, normalized, occurrenceStart, newStart);
    nextRRule = { ...nextRRule, byDay: swapped };
  }

  if (rrule.freq === 'MONTHLY') {
    // BYMONTHDAY → match the new calendar day
    if (rrule.byMonthDay?.length) {
      nextRRule = { ...nextRRule, byMonthDay: [adapter.getDate(newStart)] };
    }
    // Ordinal BYDAY → recompute ordinal + weekday for newStart
    if (rrule.byDay?.length) {
      const code = getWeekDayCode(adapter, newStart);
      const ord = computeMonthlyOrdinal(adapter, newStart);
      nextRRule = { ...nextRRule, byDay: [`${ord}${code}` as RecurringEventByDayValue] };
    }
  }

  return nextRRule;
}

/**
 * Applies an "all events" update to a recurring series.
 *
 * Rules:
 * - If the edited occurrence is not the first, keeps the original DTSTART
 *   and adjusts the RRULE pattern (e.g. weekday swap) so all past and future
 *   events follow the new pattern.
 * - If the edited occurrence is the first of the series, updates DTSTART/DTEND directly.
 * - When only the time changes, merges the new time into the original date.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateAll(
  adapter: Adapter,
  originalEvent: CalendarEvent,
  occurrenceStart: SchedulerValidDate,
  changes: CalendarEventUpdatedProperties,
): UpdateEventsParameters {
  const eventUpdatedProperties: CalendarEventUpdatedProperties = { ...changes };

  // 1) Detect if caller changed the date part of start or end (vs only time)
  const occurrenceEnd = adapter.addMinutes(
    occurrenceStart,
    diffIn(adapter, originalEvent.end, originalEvent.start, 'minutes'),
  );
  const touchedStartDate =
    changes.start != null && !adapter.isSameDay(occurrenceStart, changes.start);
  const touchedEndDate = changes.end != null && !adapter.isSameDay(occurrenceEnd, changes.end);

  // 2) Is the edited occurrence the first of the series (DTSTART)?
  const editedIsDtstart = adapter.isSameDay(occurrenceStart, originalEvent.start);

  // 3) Decide new start/end
  if (changes.start != null) {
    if (touchedStartDate) {
      // Date changed
      if (editedIsDtstart) {
        // First occurrence: allow moving DTSTART date
        eventUpdatedProperties.start = changes.start;
      } else {
        // Not first: keep original DTSTART date, merge only time
        eventUpdatedProperties.start = mergeDateAndTime(
          adapter,
          originalEvent.start,
          changes.start,
        );
      }
    } else {
      // Same day -> merge time into original date
      eventUpdatedProperties.start = mergeDateAndTime(adapter, originalEvent.start, changes.start);
    }
  }

  if (changes.end != null) {
    if (touchedEndDate) {
      if (editedIsDtstart) {
        eventUpdatedProperties.end = changes.end;
      } else {
        eventUpdatedProperties.end = mergeDateAndTime(adapter, originalEvent.end, changes.end);
      }
    } else {
      eventUpdatedProperties.end = mergeDateAndTime(adapter, originalEvent.end, changes.end);
    }
  }

  // 4) RRULE adjustment: only if day changed and the event is recurring
  if ((touchedStartDate || touchedEndDate) && originalEvent.rrule) {
    const newOccurrenceStart = changes.start ?? occurrenceStart;
    eventUpdatedProperties.rrule = adjustRRuleForAllMove(
      adapter,
      originalEvent.rrule,
      occurrenceStart,
      newOccurrenceStart,
    );
  }

  // 5) Return the updated event
  return {
    updated: [
      {
        ...eventUpdatedProperties,
      },
    ],
  };
}

/**
 * Applies a "only-this" update to a recurring series by:
 *  - creating a detached one-off event with the requested changes, and
 *  - adding an EXDATE to the original event to exclude the occurrence from the series.
 * @returns The updated list of events.
 */
export function applyRecurringUpdateOnlyThis(
  adapter: Adapter,
  originalEvent: CalendarEvent,
  occurrenceStart: SchedulerValidDate,
  changes: CalendarEventUpdatedProperties,
): UpdateEventsParameters {
  const detachedId = `${originalEvent.id}::${getDateKey(changes.start ?? originalEvent.start, adapter)}`;

  const detachedEvent: CalendarEvent = {
    ...originalEvent,
    ...changes,
    id: detachedId,
    rrule: undefined,
    extractedFromId: originalEvent.id,
  };

  return {
    created: [detachedEvent],
    updated: [
      {
        id: originalEvent.id,
        exDates: [...(originalEvent.exDates ?? []), adapter.startOfDay(occurrenceStart)],
      },
    ],
  };
}
