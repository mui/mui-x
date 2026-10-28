import { warnOnce } from '@mui/x-internals/warning';
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

/**
 * Warns when `dateLocale` isn't a language tag that `Intl` knows: an invalid tag, like `en_US`,
 * makes the views throw, and an unknown one formats the dates in the default locale of `Intl`
 * while the weeks follow another region.
 */
export function checkDateLocale(dateLocale: string) {
  if (process.env.NODE_ENV !== 'production') {
    let isValid = true;
    try {
      Intl.getCanonicalLocales(dateLocale);
    } catch {
      isValid = false;
    }
    if (!isValid) {
      warnOnce(
        [
          `MUI X Scheduler: \`dateLocale\` received "${dateLocale}", which is not a valid BCP 47 language tag.`,
          'The views throw when they format their dates with it.',
          'Pass a tag like "en-US", with a hyphen between the language and the region.',
        ].join('\n'),
      );
    } else if (Intl.DateTimeFormat.supportedLocalesOf(dateLocale).length === 0) {
      warnOnce(
        [
          `MUI X Scheduler: \`dateLocale\` received "${dateLocale}", which the \`Intl\` API of the browser does not support.`,
          'The dates are formatted in the default locale of the browser, while the weeks can follow another region.',
          'Pass a supported tag, like "en-US" or "fr-FR".',
        ].join('\n'),
      );
    }
  }
}

// Not in the TypeScript library of every supported version.
interface IntlLocaleWithWeekInfo {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

// The regions whose first week of the year has at least 4 days in that year: `minDays="4"` in
// `supplemental/weekData.xml` of CLDR 48 (ICU 78). The other regions start their first week on the
// week of January 1st. Browsers dropped the `minimalDays` of `getWeekInfo()`, so the table keeps the
// week numbers the same in all of them.
const FOUR_MINIMAL_DAYS_REGIONS = new Set(
  'AD AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GG GI GP GR HU IE IM IS IT JE LI LT LU MC MQ NL NO PL PT RE RU SE SJ SK SM VA'.split(
    ' ',
  ),
);

// The regions whose weeks don't start on Monday: `firstDay` in the same file. Only used by the
// browsers without `getWeekInfo()`, like Firefox before 153.
const SUNDAY_FIRST_DAY_REGIONS = new Set(
  'AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' ',
  ),
);
const SATURDAY_FIRST_DAY_REGIONS = new Set('AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '));

function getRegionFirstDay(region: string | undefined): WeekStartsOn {
  if (region === undefined) {
    return 1;
  }
  if (SUNDAY_FIRST_DAY_REGIONS.has(region)) {
    return 7;
  }
  if (SATURDAY_FIRST_DAY_REGIONS.has(region)) {
    return 6;
  }
  // The Maldives start their weeks on Friday.
  return region === 'MV' ? 5 : 1;
}

// The values of the `fw` extension, in the order of the ISO weekdays.
const FIRST_DAY_EXTENSION_VALUES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * The value of the `key` extension of `tag`, like `gbzzzz` for `rg` in `en-US-u-rg-gbzzzz`. The
 * private use subtags, after `-x-`, are not extensions.
 */
function getUnicodeExtension(tag: string, key: string): string | undefined {
  return new RegExp(`-u-(?:[a-z0-9-]*-)?${key}-([a-z0-9]+)`, 'i')
    .exec(tag.split('-x-')[0])?.[1]
    .toLowerCase();
}

const weekInfoLookup = new Map<string, WeekInfo>();

/**
 * The first day of the week of `locale`, from `Intl.Locale.prototype.getWeekInfo()`, and the
 * first week of the year of its region.
 */
export function getLocaleWeekInfo(locale: string): WeekInfo {
  let weekInfo = weekInfoLookup.get(locale);
  if (!weekInfo) {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & IntlLocaleWithWeekInfo;
    const tag = intlLocale.toString();
    // Older browsers have a `weekInfo` accessor instead of `getWeekInfo()`.
    const intlWeekInfo = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    // The `rg` extension overrides the region of the week, as in `getWeekInfo()`.
    const region =
      getUnicodeExtension(tag, 'rg')
        ?.match(/^[a-z]{2}/)?.[0]
        .toUpperCase() ?? intlLocale.maximize().region;
    weekInfo = {
      // The browsers without `getWeekInfo()` read the `fw` extension and the region.
      firstDay: (intlWeekInfo?.firstDay ??
        (FIRST_DAY_EXTENSION_VALUES.indexOf(getUnicodeExtension(tag, 'fw') ?? '') + 1 ||
          getRegionFirstDay(region))) as WeekStartsOn,
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

/**
 * Returns the function that gives the formatter of `options` in a locale, created once per locale.
 * Each format keeps its own, so the bundles keep only the formats they use.
 */
function createGetFormatter(options: Intl.DateTimeFormatOptions) {
  const formatters = new Map<string, Intl.DateTimeFormat>();
  return (locale: string): Intl.DateTimeFormat => {
    let formatter = formatters.get(locale);
    if (!formatter) {
      // The values are wall-clock times read in UTC. The views show the dates of the ISO calendar,
      // so the labels use the Gregorian calendar even when the locale has another one.
      formatter = new Intl.DateTimeFormat(locale, {
        ...options,
        timeZone: 'UTC',
        calendar: 'gregory',
      });
      formatters.set(locale, formatter);
    }
    return formatter;
  };
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
function toUtcDateOfPlainDate(plainDate: PlainDate): Date {
  return toUtcDate(plainDate.dayNumber * MS_PER_DAY);
}

/**
 * Returns the function that formats a date with `options` in a locale.
 */
function createDateFormat(options: Intl.DateTimeFormatOptions) {
  const getFormatter = createGetFormatter(options);
  return (locale: string, plainDate: PlainDate): string =>
    getFormatter(locale).format(toUtcDateOfPlainDate(plainDate));
}

/**
 * @example "Sunday"
 */
export const formatWeekday = /* #__PURE__ */ createDateFormat({ weekday: 'long' });

/**
 * @example "Sun"
 */
export const formatWeekdayShort = /* #__PURE__ */ createDateFormat({ weekday: 'short' });

/**
 * @example "S"
 */
export const formatWeekdayNarrow = /* #__PURE__ */ createDateFormat({ weekday: 'narrow' });

const getDayOfMonthFormatter = /* #__PURE__ */ createGetFormatter({ day: 'numeric' });

const dayOfMonthLabelLookup = new Map<string, string[]>();

/**
 * The day of the month alone, in the digits of the locale, without the literal some locales add,
 * like the `13.` of Danish or the `13日` of Japanese. The labels are cached, as every day cell
 * formats one.
 * @example "13"
 */
export function formatDayOfMonth(locale: string, plainDate: PlainDate): string {
  let labels = dayOfMonthLabelLookup.get(locale);
  if (!labels) {
    labels = [];
    dayOfMonthLabelLookup.set(locale, labels);
  }
  labels[plainDate.day] ??= getDayOfMonthFormatter(locale)
    .formatToParts(toUtcDateOfPlainDate(plainDate))
    .find((part) => part.type === 'day')!.value;
  return labels[plainDate.day];
}

/**
 * @example "Jul"
 */
export const formatMonthShort = /* #__PURE__ */ createDateFormat({ month: 'short' });

/**
 * @example "2025"
 */
export const formatYear = /* #__PURE__ */ createDateFormat({ year: 'numeric' });

/**
 * @example "Jul 13"
 */
export const formatMonthShortAndDayOfMonth = /* #__PURE__ */ createDateFormat({
  month: 'short',
  day: 'numeric',
});

/**
 * @example "July 13"
 */
export const formatMonthAndDayOfMonth = /* #__PURE__ */ createDateFormat({
  month: 'long',
  day: 'numeric',
});

/**
 * @example "Sunday, July 13"
 */
export const formatWeekdayMonthAndDayOfMonth = /* #__PURE__ */ createDateFormat({
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};

/**
 * @example "Sun, Jul 13"
 */
export const formatWeekdayShortMonthShortAndDayOfMonth = /* #__PURE__ */ createDateFormat(
  WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH,
);

const getWeekdayShortMonthShortAndDayOfMonthFormatter = /* #__PURE__ */ createGetFormatter(
  WEEKDAY_SHORT_MONTH_SHORT_AND_DAY_OF_MONTH,
);

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
  return getWeekdayShortMonthShortAndDayOfMonthFormatter(locale).formatRange(
    toUtcDateOfPlainDate(startPlainDate),
    toUtcDateOfPlainDate(endPlainDate),
  );
}

/**
 * @example "July 2025"
 */
export const formatMonthAndYear = /* #__PURE__ */ createDateFormat({
  month: 'long',
  year: 'numeric',
});

/**
 * @example "Sunday, July 13, 2025"
 */
export const formatFullDate = /* #__PURE__ */ createDateFormat({ dateStyle: 'full' });

const weekNumberFormatLookup = new Map<string, Intl.NumberFormat>();

/**
 * Formats a week number in the digits of `locale`, like the dates.
 * @example "29"
 */
export function formatWeekNumber(locale: string, weekNumber: number): string {
  let numberFormat = weekNumberFormatLookup.get(locale);
  if (!numberFormat) {
    numberFormat = new Intl.NumberFormat(locale);
    weekNumberFormatLookup.set(locale, numberFormat);
  }
  return numberFormat.format(weekNumber);
}

// The locale picks the 12-hour cycle, `h11` in Japanese, `h12` elsewhere. The 24-hour times pad the
// hour in every locale, so the time axis keeps one label width.
const getTime12hFormatter = /* #__PURE__ */ createGetFormatter({
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const getTime24hFormatter = /* #__PURE__ */ createGetFormatter({
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

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
  cycleLabels[minutesInDay] ??= (ampm ? getTime12hFormatter : getTime24hFormatter)(locale).format(
    toUtcDate(minutesInDay * 60_000),
  );
  return cycleLabels[minutesInDay];
}
