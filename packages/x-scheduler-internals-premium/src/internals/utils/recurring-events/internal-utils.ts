import type { TemporalTimezone } from '@base-ui/react/internals/temporal';
import type { Adapter } from '@mui/x-scheduler-internals/use-adapter';
import {
  buildTemporalPlainDate,
  createAdapterDate,
  getDayNumber,
  getStartOfDayMs,
  MS_PER_DAY,
  toEpochMs,
  toLocalMs,
  toMsInDay,
} from '@mui/x-scheduler-internals/internals';
import type {
  RecurringEventWeekDayCode,
  RecurringEventByDayValue,
  TemporalSupportedObject,
  SchedulerProcessedEventRecurrenceRule,
} from '@mui/x-scheduler-internals/models';
import type { BaseTemporal } from '@mui/x-scheduler-internals/internals';

/**
 * Creates the adapter value of the first instant of the last day before a plain date that exists
 * in `timezone`. A day the timezone skips, like December 30th, 2011 in Pacific/Apia, is passed over.
 */
export function createStartOfPreviousDay(
  adapter: Adapter,
  plainDate: BaseTemporal.PlainDate,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  return createAdapterDate(
    adapter,
    getStartOfDayMs(toEpochMs(plainDate, 0, timezone) - 1, timezone),
    timezone,
  );
}

/**
 * Moves the end of an event to `plainDate` on the wall clock of `timezone`, like
 * `moveToPlainDate()`, except that a time a DST transition repeats resolves to its first instant at
 * or after `startMs`, so that the end of an event starting in the second occurrence of a repeated
 * hour doesn't come before its start.
 */
export function moveEndToPlainDate(
  adapter: Adapter,
  end: TemporalSupportedObject,
  plainDate: BaseTemporal.PlainDate,
  startMs: number,
  timezone: TemporalTimezone,
): TemporalSupportedObject {
  const msInDay = toMsInDay(adapter.getTime(end), timezone);
  let endMs = toEpochMs(plainDate, msInDay, timezone);
  if (endMs < startMs) {
    // The same wall-clock time, in the offset of the start.
    const laterMs = startMs + msInDay - toMsInDay(startMs, timezone);
    if (toLocalMs(laterMs, timezone) === getDayNumber(plainDate) * MS_PER_DAY + msInDay) {
      endMs = laterMs;
    }
  }
  return createAdapterDate(adapter, endMs, timezone);
}

/**
 * The week day codes for all 7 days of the week, from Monday, like ISO days of the week.
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
 * Returns the week day code (MO..SU) of a plain date.
 */
export function getPlainDateWeekDayCode(
  plainDate: BaseTemporal.PlainDate,
): RecurringEventWeekDayCode {
  return NOT_LOCALIZED_WEEK_DAYS[plainDate.dayOfWeek - 1];
}

/**
 * Returns the week day code (MO..SU) for a given date, read in the timezone it is labeled with.
 */
export function getWeekDayCode(
  adapter: Adapter,
  date: TemporalSupportedObject,
): RecurringEventWeekDayCode {
  return getPlainDateWeekDayCode(buildTemporalPlainDate(adapter, date));
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
    throw new Error(
      `MUI X Scheduler: "${byDay}" is not a valid value for the byDay property. ` +
        'Valid values are weekday codes (MO, TU, WE, TH, FR, SA, SU) optionally prefixed with an ordinal (-5 to 5). ' +
        'Examples: "MO", "2TU", "-1FR".',
    );
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
      'MUI X Scheduler: The byDay property must contain plain weekday codes (MO..SU) without ordinals when used with weekly frequency. ' +
        'Ordinals like "1MO" or "-1FR" are only valid for monthly recurrence. ' +
        'Remove the ordinal prefixes from the byDay values.',
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
      'MUI X Scheduler: The byDay property for monthly recurrence must contain a single element with an ordinal. ' +
        'Examples: ["2TU"] for the second Tuesday or ["-1FR"] for the last Friday. ' +
        'Provide exactly one byDay value with an ordinal.',
    );
  }

  return { ord, code };
}
