import type { WeekStartsOn } from '../../models';
import { MS_PER_DAY } from './base-temporal/iso';
import type { PlainDate } from './base-temporal/PlainDate';

/**
 * The locale of the dates when the `dateLocale` prop isn't set.
 */
export const DEFAULT_DATE_LOCALE = 'en-US';

/**
 * The weeks of the views: the day they start on, and the first week of a year.
 */
export interface WeekInfo {
  /**
   * The ISO weekday the weeks start on (1 = Monday … 7 = Sunday).
   */
  firstDay: WeekStartsOn;
  /**
   * The minimal number of days of the first week of a year that are in that year.
   */
  minimalDays: number;
}

// Not in the TypeScript library of every supported version.
interface IntlLocaleWithWeekInfo {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

// The regions whose first week of the year has at least 4 days in that year, from the week data
// of CLDR. The other regions start their first week on the week of January 1st. Browsers dropped
// the `minimalDays` of `getWeekInfo()`, so the table keeps the week numbers the same in all of them.
const FOUR_MINIMAL_DAYS_REGIONS = new Set(
  'AD AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GG GI GP GR HU IE IM IS IT JE LI LT LU MC MQ NL NO PL PT RE RU SE SJ SK SM VA'.split(
    ' ',
  ),
);

const weekInfoLookup = new Map<string, WeekInfo>();

/**
 * The first day of the week of `locale`, from `Intl.Locale.prototype.getWeekInfo()`, and the
 * first week of the year of its region.
 */
export function getLocaleWeekInfo(locale: string): WeekInfo {
  let weekInfo = weekInfoLookup.get(locale);
  if (!weekInfo) {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & IntlLocaleWithWeekInfo;
    // Older browsers have a `weekInfo` accessor instead of `getWeekInfo()`.
    const intlWeekInfo = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    // The `rg` extension overrides the region of the week, as in `getWeekInfo()`. The private use
    // subtags, after `-x-`, are not extensions.
    const region =
      /-u-(?:[a-z0-9-]*-)?rg-([a-z]{2})/i
        .exec(intlLocale.toString().split('-x-')[0])?.[1]
        .toUpperCase() ?? intlLocale.maximize().region;
    weekInfo = {
      // Like the ISO 8601 weeks, for the browsers that know neither.
      firstDay: (intlWeekInfo?.firstDay ?? 1) as WeekStartsOn,
      // The ISO 8601 calendar has the ISO 8601 first week, whatever the region.
      minimalDays:
        intlLocale.calendar === 'iso8601' ||
        (region !== undefined && FOUR_MINIMAL_DAYS_REGIONS.has(region))
          ? 4
          : 1,
    };
    weekInfoLookup.set(locale, weekInfo);
  }
  return weekInfo;
}

const ampmLookup = new Map<string, boolean>();

/**
 * Whether `locale` shows the times on a 12-hour clock with AM/PM, from the hour cycle of
 * `Intl.DateTimeFormat`.
 */
export function getLocaleAmpm(locale: string): boolean {
  let ampm = ampmLookup.get(locale);
  if (ampm === undefined) {
    ampm = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12 ?? false;
    ampmLookup.set(locale, ampm);
  }
  return ampm;
}

const formatterLookup = new Map<string, Map<Intl.DateTimeFormatOptions, Intl.DateTimeFormat>>();

/**
 * The formatter of `options` in `locale`, created once.
 * The formats are module constants, one per format function, so the bundles keep only the ones
 * they use.
 */
function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  let formatters = formatterLookup.get(locale);
  if (!formatters) {
    formatters = new Map();
    formatterLookup.set(locale, formatters);
  }
  let formatter = formatters.get(options);
  if (!formatter) {
    // The values are wall-clock times read in UTC. The views show the dates of the ISO calendar,
    // so the labels use the Gregorian calendar even when the locale has another one.
    formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: 'UTC',
      calendar: 'gregory',
    });
    formatters.set(options, formatter);
  }
  return formatter;
}

/**
 * The `Date` of a wall-clock time in UTC. The formatters take a `Date` rather than its timestamp:
 * the replacements of `Intl` that fake the clock, like `@sinonjs/fake-timers`, format the current
 * date instead of a timestamp of `0`, the midnight of January 1st, 1970.
 */
function toUtcDate(epochMs: number): Date {
  return new Date(epochMs);
}

// The day number of a date is the number of days from January 1st, 1970 in UTC.
function formatDate(locale: string, plainDate: PlainDate, options: Intl.DateTimeFormatOptions) {
  return getFormatter(locale, options).format(toUtcDate(plainDate.dayNumber * MS_PER_DAY));
}

const WEEKDAY: Intl.DateTimeFormatOptions = { weekday: 'long' };

/**
 * @example "Sunday"
 */
export function formatWeekday(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, WEEKDAY);
}

const WEEKDAY_SHORT: Intl.DateTimeFormatOptions = { weekday: 'short' };

/**
 * @example "Sun"
 */
export function formatWeekdayShort(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, WEEKDAY_SHORT);
}

const WEEKDAY_NARROW: Intl.DateTimeFormatOptions = { weekday: 'narrow' };

/**
 * @example "S"
 */
export function formatWeekdayNarrow(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, WEEKDAY_NARROW);
}

const DAY_OF_MONTH: Intl.DateTimeFormatOptions = { day: 'numeric' };

/**
 * @example "13"
 */
export function formatDayOfMonth(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, DAY_OF_MONTH);
}

const MONTH_SHORT: Intl.DateTimeFormatOptions = { month: 'short' };

/**
 * @example "Jul"
 */
export function formatMonthShort(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, MONTH_SHORT);
}

const YEAR: Intl.DateTimeFormatOptions = { year: 'numeric' };

/**
 * @example "2025"
 */
export function formatYear(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, YEAR);
}

const MONTH_SHORT_AND_DAY_OF_MONTH: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

/**
 * @example "Jul 13"
 */
export function formatMonthShortAndDayOfMonth(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, MONTH_SHORT_AND_DAY_OF_MONTH);
}

const MONTH_AND_DAY_OF_MONTH: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

/**
 * @example "July 13"
 */
export function formatMonthAndDayOfMonth(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, MONTH_AND_DAY_OF_MONTH);
}

const WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

/**
 * @example "Sun, Jul 13"
 */
export function formatWeekdayShortMonthShortAndDayOfMonth(
  locale: string,
  plainDate: PlainDate,
): string {
  return formatDate(locale, plainDate, WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH);
}

/**
 * Formats the range of dates from `startPlainDate` to `endPlainDate`, both included. The locale
 * writes the separator and the parts the two dates share once.
 * @example "Sun, Jul 13 – Sat, Jul 19"
 */
export function formatWeekdayShortMonthShortAndDayOfMonthRange(
  locale: string,
  startPlainDate: PlainDate,
  endPlainDate: PlainDate,
): string {
  return getFormatter(locale, WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH).formatRange(
    toUtcDate(startPlainDate.dayNumber * MS_PER_DAY),
    toUtcDate(endPlainDate.dayNumber * MS_PER_DAY),
  );
}

const MONTH_AND_YEAR: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

/**
 * @example "July 2025"
 */
export function formatMonthAndYear(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, MONTH_AND_YEAR);
}

const FULL_DATE: Intl.DateTimeFormatOptions = { dateStyle: 'full' };

/**
 * @example "Sunday, July 13, 2025"
 */
export function formatFullDate(locale: string, plainDate: PlainDate): string {
  return formatDate(locale, plainDate, FULL_DATE);
}

const TIME_12H: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hourCycle: 'h12',
};
const TIME_24H: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  hourCycle: 'h23',
};

const timeLabelLookup = new Map<string, { ampm: string[]; h24: string[] }>();

/**
 * Formats a wall-clock time, in minutes since midnight, in `locale`. The labels are cached, as the
 * time axis formats one per hour and the events two per bound on every render.
 * @example "1:30 PM" or "13:30"
 */
export function formatTime(locale: string, minutesInDay: number, ampm: boolean): string {
  let labels = timeLabelLookup.get(locale);
  if (!labels) {
    labels = { ampm: [], h24: [] };
    timeLabelLookup.set(locale, labels);
  }
  const cycleLabels = ampm ? labels.ampm : labels.h24;
  cycleLabels[minutesInDay] ??= getFormatter(locale, ampm ? TIME_12H : TIME_24H).format(
    toUtcDate(minutesInDay * 60_000),
  );
  return cycleLabels[minutesInDay];
}
