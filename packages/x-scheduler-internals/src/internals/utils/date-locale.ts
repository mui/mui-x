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
      minimalDays: region !== undefined && FOUR_MINIMAL_DAYS_REGIONS.has(region) ? 4 : 1,
    };
    weekInfoLookup.set(locale, weekInfo);
  }
  return weekInfo;
}

const DATE_FORMATS = {
  /**
   * @example "Sunday"
   */
  weekday: { weekday: 'long' },
  /**
   * @example "Sun"
   */
  weekdayShort: { weekday: 'short' },
  /**
   * @example "S"
   */
  weekdayNarrow: { weekday: 'narrow' },
  /**
   * @example "13"
   */
  dayOfMonth: { day: 'numeric' },
  /**
   * @example "Jul"
   */
  monthShort: { month: 'short' },
  /**
   * @example "2025"
   */
  year: { year: 'numeric' },
  /**
   * @example "Jul 13"
   */
  monthShortAndDayOfMonth: { month: 'short', day: 'numeric' },
  /**
   * @example "July 13"
   */
  monthAndDayOfMonth: { month: 'long', day: 'numeric' },
  /**
   * @example "Sun, Jul 13"
   */
  weekdayShortMonthShortAndDayOfMonth: { weekday: 'short', month: 'short', day: 'numeric' },
  /**
   * @example "July 2025"
   */
  monthAndYear: { month: 'long', year: 'numeric' },
  /**
   * @example "Sunday, July 13, 2025"
   */
  fullDate: { dateStyle: 'full' },
  /**
   * @example "1:30 PM"
   */
  time12h: { hour: 'numeric', minute: '2-digit', hourCycle: 'h12' },
  /**
   * @example "13:30"
   */
  time24h: { hour: 'numeric', minute: '2-digit', hourCycle: 'h23' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type SchedulerDateFormat = keyof typeof DATE_FORMATS;

const formatterLookup = new Map<
  string,
  Partial<Record<SchedulerDateFormat, Intl.DateTimeFormat>>
>();

function getFormatter(locale: string, format: SchedulerDateFormat): Intl.DateTimeFormat {
  let formatters = formatterLookup.get(locale);
  if (!formatters) {
    formatters = {};
    formatterLookup.set(locale, formatters);
  }
  // The values are wall-clock times read in UTC. The views show the dates of the ISO calendar, so
  // the labels use the Gregorian calendar even when the locale has another one.
  formatters[format] ??= new Intl.DateTimeFormat(locale, {
    ...DATE_FORMATS[format],
    timeZone: 'UTC',
    calendar: 'gregory',
  });
  return formatters[format];
}

/**
 * Formats a date in `locale`.
 */
export function formatPlainDate(
  locale: string,
  plainDate: PlainDate,
  format: SchedulerDateFormat,
): string {
  // The day number of a date is the number of days from January 1st, 1970 in UTC.
  return getFormatter(locale, format).format(plainDate.dayNumber * MS_PER_DAY);
}

const timeLabelLookup = new Map<string, Record<'time12h' | 'time24h', string[]>>();

/**
 * Formats a wall-clock time, in minutes since midnight, in `locale`. The labels are cached, as the
 * time axis formats one per hour and the events two per bound on every render.
 * @example "1:30 PM" or "13:30"
 */
export function formatTime(locale: string, minutesInDay: number, ampm: boolean): string {
  let labels = timeLabelLookup.get(locale);
  if (!labels) {
    labels = { time12h: [], time24h: [] };
    timeLabelLookup.set(locale, labels);
  }
  const format = ampm ? 'time12h' : 'time24h';
  labels[format][minutesInDay] ??= getFormatter(locale, format).format(minutesInDay * 60_000);
  return labels[format][minutesInDay];
}
