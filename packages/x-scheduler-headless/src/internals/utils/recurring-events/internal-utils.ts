import { Adapter } from '../../../use-adapter';
import {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  SchedulerProcessedEvent,
  TemporalSupportedObject,
  SchedulerProcessedEventRecurrenceRule,
} from '../../../models';

const adapterCache = new WeakMap<
  Adapter,
  {
    /**
     * Week day number (1..7) of Monday for a given adapter.
     */
    mondayWeekDayNumber: number;
    /**
     * Date format string for UNTIL serialization (RFC5545 format: YYYYMMDDTHHmmssZ)
     */
    untilFormat: string;
  }
>();

/**
 * Returns cached adapter data.
 */
export function getAdapterCache(adapter: Adapter) {
  let cache = adapterCache.get(adapter);
  if (!cache) {
    const f = adapter.formats;
    const dateFormat = `${f.yearPadded}${f.monthPadded}${f.dayOfMonthPadded}`;
    const dateTimeSeparator = `${adapter.escapedCharacters.start}T${adapter.escapedCharacters.end}`;
    const timeFormat = `${f.hours24hPadded}${f.minutesPadded}${f.secondsPadded}`;
    const timezoneSuffix = `${adapter.escapedCharacters.start}Z${adapter.escapedCharacters.end}`;
    const untilFormat = `${dateFormat}${dateTimeSeparator}${timeFormat}${timezoneSuffix}`;

    cache = {
      untilFormat,
      mondayWeekDayNumber: adapter.getDayOfWeek(adapter.date('2025-01-06T00:00:00Z', 'utc')), // ISO Monday
    };
    adapterCache.set(adapter, cache);
  }
  return cache;
}

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

/**
 * A map of week day codes to their indexes in NOT_LOCALIZED_WEEK_DAYS.
 */
export const NOT_LOCALIZED_WEEK_DAYS_INDEXES = new Map<RecurringEventWeekDayCode, number>(
  NOT_LOCALIZED_WEEK_DAYS.map((code, index) => [code, index]),
);

/**
 * Returns the week day code (MO..SU) for a given date.
 * Day numbers come from adapter.getDayOfWeek(), so it respects the adapter’s locale numbering.
 */
export function getWeekDayCode(
  adapter: Adapter,
  date: TemporalSupportedObject,
): RecurringEventWeekDayCode {
  const dayOfWeek = adapter.getDayOfWeek(date);
  const mondayWeekDayNumber = getAdapterCache(adapter).mondayWeekDayNumber;
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
  const mondayWeekDayNumber = getAdapterCache(adapter).mondayWeekDayNumber;
  const indexOfCode = NOT_LOCALIZED_WEEK_DAYS_INDEXES.get(code)!;
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
    throw new Error(`MUI: ${byDay} is not a valid value for the byDay property.`);
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
  ruleByDay: SchedulerProcessedEventRecurrenceRule['byDay'] | undefined,
): RecurringEventWeekDayCode[] | null {
  if (!ruleByDay?.length) {
    return null;
  }
  const parsed = ruleByDay.map(tokenizeByDay);
  if (parsed.some((item) => item.ord !== null)) {
    throw new Error(
      'MUI: The byDay property must be a plain MO..SU (no ordinals like 1MO, -1FR) when used with a weekly frequency.',
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
      'MUI: The byDay property must contain a single element with an ordinal (e.g. ["2TU"] or ["-1FR"]).',
    );
  }

  return { ord, code };
}

/**
 *  Duration of the event in days.
 *  @returns At least 1, start==end yields 1.
 */
export function getEventDurationInDays(adapter: Adapter, event: SchedulerProcessedEvent): number {
  // +1 so start/end same day = 1 day, spans include last day
  return (
    adapter.differenceInDays(
      adapter.startOfDay(event.dataTimezone.end.value),
      adapter.startOfDay(event.dataTimezone.start.value),
    ) + 1
  );
}

/**
 * Returns the startOfDay for the Nth weekday in a given month.
 * ordinal > 0 → Nth from the start (1..5). ordinal < 0 → Nth from the end (-1 = last).
 * If that occurrence doesn't exist in the month, returns null.
 */
export function nthWeekdayOfMonth(
  adapter: Adapter,
  monthStart: TemporalSupportedObject,
  weekdayCode: RecurringEventWeekDayCode,
  ordinal: number,
): TemporalSupportedObject | null {
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

const GET_REMAINING_OCCURRENCES_METHOD_LOOKUP = {
  DAILY: getRemainingDailyOccurrences,
  WEEKLY: getRemainingWeeklyOccurrences,
  MONTHLY: getRemainingMonthlyOccurrences,
  YEARLY: getRemainingYearlyOccurrences,
};

/**
 *  Computes how many occurrences remain after `date` (inclusive) given a total `count`.
 *  Used to enforce COUNT. Delegates to frequency-specific counters.
 *  Returns `count` if `date` is before DTSTART (day precision).
 *  Returns 0 if all occurrences have been consumed.
 */
export function getRemainingOccurrences(
  adapter: Adapter,
  rule: SchedulerProcessedEventRecurrenceRule,
  seriesStart: TemporalSupportedObject,
  date: TemporalSupportedObject,
  count: number,
): number {
  const seriesStartDay = adapter.startOfDay(seriesStart);

  const method = GET_REMAINING_OCCURRENCES_METHOD_LOOKUP[rule.freq];
  if (!method) {
    throw new Error(
      [
        `MUI: Unknown frequency ${rule.freq}.`,
        'Expected: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY".',
      ].join('\n'),
    );
  }

  return method({ adapter, rule, seriesStartDay, date, count });
}

interface GetRemainingOccurrencesParameters {
  adapter: Adapter;
  rule: SchedulerProcessedEventRecurrenceRule;
  /**
   * The series start date (DTSTART).
   * This is normalized to startOfDay internally.
   */
  seriesStartDay: TemporalSupportedObject;
  date: TemporalSupportedObject;
  /**
   * The total count of occurrences allowed.
   */
  count: number;
}

/**
 *  Given a week start and a BYDAY code, returns the exact date in that week.
 */
export function dayInWeek(
  adapter: Adapter,
  weekStart: TemporalSupportedObject,
  code: RecurringEventWeekDayCode,
) {
  const weekStartDow = adapter.getDayOfWeek(weekStart);
  const ruleDow = getWeekDayNumberFromCode(adapter, code);
  const delta = (((ruleDow - weekStartDow) % 7) + 7) % 7;
  return adapter.startOfDay(adapter.addDays(weekStart, delta));
}

/**
 * Remaining DAILY occurrences after `date` (inclusive).
 */
export function getRemainingDailyOccurrences(
  parameters: GetRemainingOccurrencesParameters,
): number {
  const { adapter, rule, seriesStartDay, date, count } = parameters;
  if (adapter.isBefore(date, seriesStartDay)) {
    return count;
  }

  const interval = Math.max(1, rule.interval ?? 1);
  const totalDays = adapter.differenceInDays(adapter.startOfDay(date), seriesStartDay);
  const occurrencesSoFar = Math.floor(totalDays / interval) + 1;

  return Math.max(0, count - occurrencesSoFar);
}

/**
 *  Remaining WEEKLY occurrences after `date` (inclusive).
 *  Iterates weeks by `interval`, checking each BYDAY. Skips days before DTSTART.
 *  BYDAY defaults to DTSTART weekday if omitted.
 *  Short-circuits when count is exhausted.
 */
export function getRemainingWeeklyOccurrences(
  parameters: GetRemainingOccurrencesParameters,
): number {
  const { adapter, rule, seriesStartDay, date, count } = parameters;
  if (adapter.isBefore(date, seriesStartDay)) {
    return count;
  }

  const byDay = parsesByDayForWeeklyFrequency(rule.byDay) ?? [
    getWeekDayCode(adapter, seriesStartDay),
  ];

  const interval = Math.max(1, rule.interval ?? 1);

  // IMPORTANT: weekly COUNT math must use RRULE week boundaries (WKST, default Monday),
  // not adapter.startOfWeek() which is locale-driven (often Sunday). Using locale weeks can
  // make remaining occurrences off (and even produce backwards weekly navigation) for BYDAY
  // combinations like SU+TU, especially when timezone projection shifts weekdays.
  // See issue #20755 for reference.
  const seriesWeekStart = startOfRRuleWeek(adapter, seriesStartDay);
  const targetWeekStart = startOfRRuleWeek(adapter, date);

  const dateEndDay = adapter.endOfDay(date);

  let remaining = count;

  // Iterate weeks from start to target, stepping by `interval`
  for (
    let week = seriesWeekStart;
    !adapter.isAfter(week, targetWeekStart) && remaining > 0;
    week = adapter.addWeeks(week, interval)
  ) {
    // For the current week, check each weekday specified in BYDAY
    for (const code of byDay) {
      const occurrenceDay = dayInWeek(adapter, week, code);

      if (!adapter.isWithinRange(occurrenceDay, [seriesStartDay, dateEndDay])) {
        continue;
      }

      remaining -= 1;
    }
  }

  return remaining;
}

/**
 * Remaining MONTHLY occurrences after `date` (inclusive).
 * Modes: BYDAY with a single ordinal (e.g. "2TU" or "-1FR"; only one element) OR single BYMONTHDAY (default = DTSTART day).
 * Skips months without a match. Steps by `interval`, respecting series start and target boundaries.
 * Short-circuits when count is exhausted.
 * @throws If BYDAY is combined with BYMONTHDAY, or BYMONTHDAY has >1 value.
 */
export function getRemainingMonthlyOccurrences(
  parameters: GetRemainingOccurrencesParameters,
): number {
  const { adapter, rule, seriesStartDay, date, count } = parameters;
  const seriesStartMonth = adapter.startOfMonth(seriesStartDay);
  const targetMonth = adapter.startOfMonth(date);
  if (adapter.isBefore(targetMonth, seriesStartMonth)) {
    return count;
  }

  const dateEndDay = adapter.endOfDay(date);
  const interval = Math.max(1, rule.interval ?? 1);

  // Path A: BYDAY with ordinals (e.g. 2TU, -1FR). Not mixed with BYMONTHDAY.
  if (rule.byDay?.length) {
    if (rule.byMonthDay?.length) {
      throw new Error(
        'MUI: The monthly recurrences cannot have both the byDay and the byMonthDay properties.',
      );
    }

    const { ord, code } = parsesByDayForMonthlyFrequency(rule.byDay);

    let remaining = count;
    for (
      let month = seriesStartMonth;
      !adapter.isAfter(month, targetMonth) && remaining > 0;
      month = adapter.addMonths(month, interval)
    ) {
      const occurrenceDate = nthWeekdayOfMonth(adapter, month, code, ord);
      if (!occurrenceDate) {
        continue;
      }

      if (!adapter.isWithinRange(occurrenceDate, [seriesStartDay, dateEndDay])) {
        continue;
      }

      remaining -= 1;
    }
    return remaining;
  }

  // Path B: BYMONTHDAY (single mode, default to DTSTART day)
  if ((rule.byMonthDay?.length ?? 0) > 1) {
    throw new Error(
      "MUI: The monthly recurrences don't support byMonthDay with multiple elements.",
    );
  }

  // If no BYMONTHDAY is provided in a MONTHLY rule, default to the day of month of DTSTART.
  const dayOfMonth = rule.byMonthDay?.length ? rule.byMonthDay[0] : adapter.getDate(seriesStartDay);

  let remaining = count;

  // Iterate months from start to target, stepping by `interval`
  for (
    let month = seriesStartMonth;
    !adapter.isAfter(month, targetMonth) && remaining > 0;
    month = adapter.addMonths(month, interval)
  ) {
    // if the day doesn't exist in this month, skip it
    const daysInMonth = adapter.getDaysInMonth(month);
    if (dayOfMonth > daysInMonth) {
      continue;
    }

    const candidate = adapter.startOfDay(adapter.setDate(month, dayOfMonth));
    if (!adapter.isWithinRange(candidate, [seriesStartDay, dateEndDay])) {
      continue;
    }

    remaining -= 1;
  }

  return remaining;
}

/**
 *  Remaining YEARLY occurrences after `date` (inclusive).
 *  Only same month/day as DTSTART, skips non-leap years for Feb 29.
 *  Iterates years by `interval`, bounded by series start and target year.
 *  Short-circuits when count is exhausted.
 *  @throws If BYMONTH/DAY/BYDAY are present (unsupported for YEARLY at the moment).
 */
export function getRemainingYearlyOccurrences(
  parameters: GetRemainingOccurrencesParameters,
): number {
  const { adapter, rule, seriesStartDay, date, count } = parameters;

  const seriesStartYear = adapter.startOfYear(seriesStartDay);
  const dateEndDay = adapter.endOfDay(date);
  const targetYearStart = adapter.startOfYear(date);
  if (adapter.isBefore(targetYearStart, seriesStartYear)) {
    return count;
  }

  const interval = Math.max(1, rule.interval ?? 1);

  // Only the exact same calendar date is supported for YEARLY (month and day of DTSTART).
  // Any use of BYMONTH, BYMONTHDAY, or BYDAY is not allowed at the moment.
  if (rule.byMonth?.length || rule.byMonthDay?.length || rule.byDay?.length) {
    throw new Error(
      'MUI: The yearly recurrences must NOT use byMonth, byMonthDay, or byDay. Only exact same date recurrence (month/day of DTSTART) is supported.',
    );
  }

  const targetMonth = adapter.getMonth(seriesStartDay);
  const targetDayOfMonth = adapter.getDate(seriesStartDay);

  let remaining = count;

  // Iterate years from the series start (inclusive) to the target year (inclusive),
  // stepping by `interval`.
  for (
    let year = seriesStartYear;
    !adapter.isAfter(year, targetYearStart) && remaining > 0;
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

    if (!adapter.isWithinRange(candidate, [seriesStartDay, dateEndDay])) {
      continue;
    }

    remaining -= 1;
  }

  return remaining;
}

/**
 * RRULE weekly expansion must use a Monday-based "recurrence week".
 * We MUST NOT use adapter.startOfWeek() because it's locale-driven (often Sunday in en-US),
 * which can reorder weekly occurrences for BYDAY combos like SU+TU and break COUNT,
 * especially when timezone projection shifts weekdays around the week boundary.
 */
export function startOfRRuleWeek(adapter: Adapter, date: TemporalSupportedObject) {
  // RRULE default week start is Monday (MO)
  const dow = adapter.getDayOfWeek(date); // 1..7 from adapter
  const monday = getAdapterCache(adapter).mondayWeekDayNumber; // the number that corresponds to Monday
  const delta = (((dow - monday) % 7) + 7) % 7; // days since Monday
  return adapter.startOfDay(adapter.addDays(date, -delta));
}
