import { ISO_CALENDAR_ID } from './calendar';

type FormatOptions = Intl.DateTimeFormatOptions;

const DATE_OPTIONS = ['year', 'month', 'day', 'weekday', 'era', 'dateStyle'] as const;
const TIME_OPTIONS = [
  'hour',
  'minute',
  'second',
  'fractionalSecondDigits',
  'dayPeriod',
  'timeStyle',
] as const;
const DATE_DEFAULTS: FormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
const TIME_DEFAULTS: FormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

function hasAnyOption(options: FormatOptions, keys: readonly (keyof FormatOptions)[]) {
  return keys.some((key) => options[key] !== undefined);
}

function checkCalendar(
  name: string,
  calendarId: string,
  formatter: Intl.DateTimeFormat,
  zoned: boolean,
) {
  const localeCalendar = formatter.resolvedOptions().calendar;
  // Like Temporal, a value of another calendar than ISO is only shown in its own calendar. A zoned
  // value is also shown in a locale whose calendar is ISO.
  if (
    calendarId !== ISO_CALENDAR_ID &&
    calendarId !== localeCalendar &&
    !(zoned && localeCalendar === ISO_CALENDAR_ID)
  ) {
    throw new Error(
      `MUI X Scheduler: \`BaseTemporal.${name}.prototype.toLocaleString()\` received a value of the "${calendarId}" calendar and a locale that formats dates in the "${localeCalendar}" calendar. ` +
        'The value would be shown in another calendar than its own. ' +
        "Pass a locale of this calendar, such as `'en-US-u-ca-hebrew'` for the Hebrew calendar, or convert the value with `withCalendar()`.",
    );
  }
}

/**
 * Formats a date, a time or a date-time without timezone, like `toLocaleString()` of Temporal:
 * the options of the parts the value doesn't have are left out, the parts it has are shown by
 * default, and its clock time is shown as is, without timezone.
 * @param name The name of the class, such as `PlainDate`.
 * @param parts The parts the value has.
 * @param wallClock The date and clock time of the value, in milliseconds since 1970-01-01T00:00 of
 * the wall clock: `1970-01-01` for a time.
 */
export function formatPlainValue(
  name: string,
  parts: 'date' | 'time' | 'dateTime',
  wallClock: number,
  calendarId: string,
  locales: string | string[] | undefined,
  options: FormatOptions | undefined,
): string {
  const givenOptions = options ?? {};
  if (givenOptions.timeZone !== undefined) {
    // Like Temporal, an unknown timezone throws, though the clock time is shown as is.
    // eslint-disable-next-line no-new
    new Intl.DateTimeFormat(undefined, { timeZone: givenOptions.timeZone });
  }
  // The clock time is read in UTC, which has no transitions to move it.
  const formatOptions: FormatOptions = {
    ...givenOptions,
    timeZone: 'UTC',
    timeZoneName: undefined,
  };
  const missingOptions = { date: TIME_OPTIONS, time: DATE_OPTIONS, dateTime: [] }[parts];
  for (const key of missingOptions) {
    formatOptions[key] = undefined;
  }
  if (!hasAnyOption(formatOptions, DATE_OPTIONS) && !hasAnyOption(formatOptions, TIME_OPTIONS)) {
    if (hasAnyOption(givenOptions, DATE_OPTIONS) || hasAnyOption(givenOptions, TIME_OPTIONS)) {
      throw new TypeError(
        `MUI X Scheduler: \`BaseTemporal.${name}.prototype.toLocaleString()\` received options that only format parts the value doesn't have. ` +
          'Nothing would be left to show. ' +
          'Pass options of the parts of the value, such as `{ hour: "numeric" }` for a time, or leave the options out.',
      );
    }
    Object.assign(
      formatOptions,
      parts === 'time' ? undefined : DATE_DEFAULTS,
      parts === 'date' ? undefined : TIME_DEFAULTS,
    );
  }
  const formatter = new Intl.DateTimeFormat(locales, formatOptions);
  checkCalendar(name, calendarId, formatter, false);
  if (formatOptions.timeStyle !== 'long' && formatOptions.timeStyle !== 'full') {
    return formatter.format(wallClock);
  }
  // The long and full styles name the timezone, which a value without timezone doesn't show.
  const formattedParts = formatter.formatToParts(wallClock);
  const zoneIndex = formattedParts.findIndex((part) => part.type === 'timeZoneName');
  const separatorIndex = formattedParts[zoneIndex - 1]?.type === 'literal' ? zoneIndex - 1 : -1;
  return formattedParts
    .filter((_, index) => index !== zoneIndex && index !== separatorIndex)
    .map((part) => part.value)
    .join('');
}

/**
 * Formats an instant in a timezone, like `ZonedDateTime.prototype.toLocaleString()` of Temporal:
 * the date, the clock time and the short name of the timezone by default.
 */
export function formatZonedValue(
  epochMilliseconds: number,
  timeZoneId: string,
  calendarId: string,
  locales: string | string[] | undefined,
  options: FormatOptions | undefined,
): string {
  const givenOptions = options ?? {};
  if (givenOptions.timeZone !== undefined) {
    throw new TypeError(
      'MUI X Scheduler: `BaseTemporal.ZonedDateTime.prototype.toLocaleString()` received a `timeZone` option. ' +
        'A zoned date-time is always shown in its own timezone. ' +
        'Leave the option out, or call `withTimeZone()` first to show the instant in another timezone.',
    );
  }
  const formatOptions: FormatOptions = { ...givenOptions, timeZone: timeZoneId };
  if (!hasAnyOption(formatOptions, DATE_OPTIONS) && !hasAnyOption(formatOptions, TIME_OPTIONS)) {
    Object.assign(formatOptions, DATE_DEFAULTS, TIME_DEFAULTS);
    formatOptions.timeZoneName ??= 'short';
  }
  const formatter = new Intl.DateTimeFormat(locales, formatOptions);
  checkCalendar('ZonedDateTime', calendarId, formatter, true);
  return formatter.format(epochMilliseconds);
}
