import {
  FIRST_SUPPORTED_DAY,
  formatIsoDate,
  fromDayNumber,
  getDaysInMonth,
  isValidIsoDate,
  LAST_SUPPORTED_DAY,
  toDayNumber,
  toInteger,
} from './iso';

/**
 * A calendar system that `registerCalendar()` adds, such as `hebrewCalendar`.
 */
export interface CalendarSystem {
  /**
   * The calendar identifier, as in `Intl.DateTimeFormat`, such as `'hebrew'`.
   */
  readonly id: string;
}

/**
 * The year, ordinal month and day of a date in a calendar.
 */
export interface CalendarFields {
  year: number;
  month: number;
  day: number;
}

/**
 * The fields of a date in a calendar.
 */
export interface CalendarDate extends CalendarFields {
  monthCode: string;
  era: string | undefined;
  eraYear: number | undefined;
}

/**
 * Date fields in a calendar, as `from()` and `with()` read them.
 */
export interface CalendarDateFieldsInput {
  year?: number | undefined;
  era?: string | undefined;
  eraYear?: number | undefined;
  month?: number | undefined;
  monthCode?: string | undefined;
  day?: number | undefined;
}

/**
 * The arithmetic of a calendar system. Years are arithmetic years: they keep counting below 1
 * instead of switching era. Months are ordinal: the first month of the year is 1.
 * The operations at the end come from `defineCalendar()` in the calendar systems of the Base UI
 * version, so the bundles that only use the ISO calendar don't include their general form.
 */
export interface CalendarImplementation extends CalendarSystem {
  /**
   * The first and last days the calendar supports, as day numbers inside the days `Date` supports.
   * `Intl.DateTimeFormat` labels every day between them as the arithmetic below does.
   */
  readonly firstDay: number;
  readonly lastDay: number;
  /**
   * The codes of every month a year can have, in calendar order, such as `M05L` for the Hebrew
   * leap month Adar I between `M05` and `M06`.
   */
  readonly monthCodes: readonly string[];
  /**
   * The most days a month can have.
   */
  readonly maxDaysInMonth: number;
  fromDayNumber: (dayNumber: number) => CalendarFields;
  /**
   * Expects a month and a day that exist in the year.
   */
  toDayNumber: (year: number, month: number, day: number) => number;
  getDaysInMonth: (year: number, month: number) => number;
  /**
   * The codes of the months of a year, in order. Defaults to every code.
   */
  getMonthCodes?: ((year: number) => readonly string[]) | undefined;
  /**
   * The month code that replaces a code the year doesn't have when `overflow` is `'constrain'`,
   * such as `M06` (Adar) for `M05L` (Adar I) in a Hebrew common year.
   */
  constrainMonthCode?: ((monthCode: string) => string) | undefined;
  /**
   * The eras fields can edit, in chronological order, such as `['bce', 'ce']`. Calendars with a
   * single era leave it undefined.
   */
  eras?: readonly string[] | undefined;
  /**
   * The era and year of era of a date, `undefined` for a calendar without eras.
   */
  getEra?: ((year: number, dayNumber: number) => { era: string; eraYear: number }) | undefined;
  /**
   * The arithmetic year of a year of era, `undefined` for an unknown era code.
   */
  getYearFromEra?: ((era: string, eraYear: number) => number | undefined) | undefined;
  /**
   * Whether `Intl.DateTimeFormat` prints the years before the epoch as negative years of the first
   * era rather than as years of the era before, as for `islamic` (-640 AH). Fields otherwise
   * display the year of the era of each date.
   */
  printsYearsBeforeEpoch?: boolean | undefined;
  /**
   * Whether `Intl.DateTimeFormat` prints the year of the era in every format, as in `japanese`,
   * whose eras start mid-year. Fields then always edit the year of an era.
   */
  countsYearsInEras?: boolean | undefined;
  /**
   * The fields of a day, including its month code and era.
   */
  getDate: (dayNumber: number) => CalendarDate;
  /**
   * Resolves date fields read in the calendar to a day number, adjusting fields above their range
   * when `overflow` is `'constrain'`. Throws for missing, conflicting or rejected fields. Absent
   * for the ISO and Gregorian calendars, which `resolveIsoFields` reads.
   */
  resolveFields?:
    | ((
        fields: CalendarDateFieldsInput,
        overflow: 'constrain' | 'reject',
        apiName: string,
      ) => number)
    | undefined;
  /**
   * Adds months, counting each year's own months, and clamps the day to the target month.
   */
  addMonths: (dayNumber: number, months: number) => number;
  /**
   * Adds years, keeping the month code, or its replacement in a year without it, and clamps the
   * day to the target month.
   */
  addYears: (dayNumber: number, years: number) => number;
}

export const ISO_CALENDAR_ID = 'iso8601';

const MONTH_CODES = /* @__PURE__ */ Array.from(
  { length: 13 },
  (_, index) => `M${String(index + 1).padStart(2, '0')}`,
);

/**
 * The codes `M01` to `M12`, or to `M13` with `count` 13.
 */
export function getOrdinalMonthCodes(count: 12 | 13): readonly string[] {
  return MONTH_CODES.slice(0, count);
}

/**
 * Throws the error of date fields that don't name a single date of a calendar. `problem`
 * completes the sentence "received date fields that …".
 */
export function throwFieldsError(apiName: string, problem: string): never {
  throw new Error(
    `MUI X Scheduler: \`BaseTemporal.${apiName}\` received date fields that ${problem}. ` +
      "The fields don't name a single date of the calendar. " +
      'Pass a year (or an era and a year of era), a month (or a month code) and a day that exist in the calendar.',
  );
}

function readOptionalInteger(value: unknown, field: string) {
  return value === undefined ? undefined : toInteger(value, field);
}

function readPositiveInteger(value: unknown, field: 'month' | 'day', apiName: string) {
  const integer = readOptionalInteger(value, field);
  if (integer !== undefined && integer < 1) {
    throwFieldsError(apiName, `have a ${field} below 1`);
  }
  return integer;
}

/**
 * Date fields converted by `readCalendarFields()`, with the year an era and a year of era name.
 * Either `month` or `monthCode` is set.
 */
export interface CalendarFieldsRead {
  year: number;
  month: number | undefined;
  monthCode: string | undefined;
  day: number;
}

/**
 * Converts date fields like Temporal, in its order: numbers are truncated, and a month or a day
 * below 1 throws. Then throws a `TypeError` for a missing field: a year, or an era and a year of
 * era together, a month or a month code, and a day. A calendar without eras ignores their fields.
 * Last, resolves an era and a year of era to a year, and throws when the calendar doesn't have
 * them or when they don't name `year`.
 */
export function readCalendarFields(
  calendar: Pick<CalendarImplementation, 'id' | 'getYearFromEra'>,
  item: CalendarDateFieldsInput,
  apiName: string,
): CalendarFieldsRead {
  const hasEras = calendar.getYearFromEra != null;
  const day = readPositiveInteger(item.day, 'day', apiName);
  const era = hasEras && item.era !== undefined ? String(item.era) : undefined;
  const eraYear = hasEras ? readOptionalInteger(item.eraYear, 'eraYear') : undefined;
  const month = readPositiveInteger(item.month, 'month', apiName);
  const monthCode = item.monthCode === undefined ? undefined : String(item.monthCode);
  const year = readOptionalInteger(item.year, 'year');
  let missing: string | undefined;
  if (era === undefined && eraYear !== undefined) {
    missing = 'an era';
  } else if (era !== undefined && eraYear === undefined) {
    missing = 'a year of era';
  } else if (year === undefined && era === undefined) {
    missing = 'a year';
  } else if (month === undefined && monthCode === undefined) {
    missing = 'a month or a month code';
  } else if (day === undefined) {
    missing = 'a day';
  }
  if (missing !== undefined) {
    throw new TypeError(
      `MUI X Scheduler: \`BaseTemporal.${apiName}\` received an object without ${missing}. ` +
        "A date can't be built without its year, month and day. " +
        'Pass an object such as `{ year: 2024, month: 5, day: 24 }`, with an era and a year of era together in place of the year if needed.',
    );
  }
  let resolvedYear = year;
  if (era !== undefined) {
    resolvedYear = calendar.getYearFromEra!(era, eraYear!);
    if (resolvedYear === undefined || (year !== undefined && year !== resolvedYear)) {
      throwFieldsError(
        apiName,
        `have an era and a year of era the "${calendar.id}" calendar can't use`,
      );
    }
  }
  return { year: resolvedYear!, month, monthCode, day: day! };
}

/**
 * Throws when ISO date parts don't name a supported date.
 */
export function checkIsoDate(year: number, month: number, day: number) {
  if (!isValidIsoDate(year, month, day)) {
    throw new Error(
      `MUI X Scheduler: \`PlainDate\` received the year ${year}, the month ${month} and the day ${day}, which don't name a supported date. ` +
        'The month must be from 1 to 12, the day must exist in the month, and the date must be from -271821-04-20 to +275760-09-13, the days of `Date`. ' +
        'Pass a valid date, or create it with `BaseTemporal.PlainDate.from()` and an object to move a month or a day above its range to the closest valid value.',
    );
  }
}

/**
 * Adds ISO months, clamping the day to the last day of the target month.
 */
export function addIsoMonths(dayNumber: number, months: number): number {
  const { year, month, day } = fromDayNumber(dayNumber);
  const monthIndex = year * 12 + month - 1 + months;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonth = monthIndex - targetYear * 12 + 1;
  return toDayNumber(
    targetYear,
    targetMonth,
    Math.min(day, getDaysInMonth(targetYear, targetMonth)),
  );
}

/**
 * The Gregorian era of a year, `ce` or `bce`.
 */
export const getGregorianEra = (year: number) =>
  year > 0 ? { era: 'ce', eraYear: year } : { era: 'bce', eraYear: 1 - year };

/**
 * The year of a Gregorian year of era, or `undefined` for another era.
 */
export function getGregorianYearFromEra(era: string, eraYear: number) {
  if (era === 'ce' || era === 'ad') {
    return eraYear;
  }
  return era === 'bce' || era === 'bc' ? 1 - eraYear : undefined;
}

/**
 * The ISO calendar, or the Gregorian calendar, which adds the `ce` and `bce` eras.
 */
function createIsoCalendar(id: string, hasEras: boolean): CalendarImplementation {
  return {
    id,
    firstDay: FIRST_SUPPORTED_DAY,
    lastDay: LAST_SUPPORTED_DAY,
    monthCodes: MONTH_CODES.slice(0, 12),
    maxDaysInMonth: 31,
    fromDayNumber,
    toDayNumber,
    getDaysInMonth,
    eras: hasEras ? ['bce', 'ce'] : undefined,
    getEra: hasEras ? getGregorianEra : undefined,
    getYearFromEra: hasEras ? getGregorianYearFromEra : undefined,
    getDate: (dayNumber) => {
      const date = fromDayNumber(dayNumber);
      const era = hasEras ? getGregorianEra(date.year) : undefined;
      return {
        ...date,
        monthCode: MONTH_CODES[date.month - 1],
        era: era?.era,
        eraYear: era?.eraYear,
      };
    },
    addMonths: addIsoMonths,
    addYears: (dayNumber, years) => addIsoMonths(dayNumber, years * 12),
  };
}

/**
 * Resolves date fields read in the ISO or the Gregorian calendar to a day number.
 */
export function resolveIsoFields(
  calendar: CalendarImplementation,
  item: CalendarDateFieldsInput,
  overflow: 'constrain' | 'reject',
  apiName: string,
): number {
  const fields = readCalendarFields(calendar, item, apiName);
  const year = fields.year;
  const codeMonth =
    fields.monthCode === undefined ? undefined : MONTH_CODES.indexOf(fields.monthCode) + 1;
  if (
    codeMonth !== undefined &&
    (codeMonth < 1 || codeMonth > 12 || (fields.month !== undefined && fields.month !== codeMonth))
  ) {
    throwFieldsError(apiName, `have a month code the "${calendar.id}" calendar can't use`);
  }
  let month = codeMonth ?? fields.month!;
  let day = fields.day;
  if (overflow === 'constrain') {
    month = Math.min(month, 12);
    day = Math.min(day, getDaysInMonth(year, month));
  }
  checkIsoDate(year, month, day);
  return toDayNumber(year, month, day);
}

const ISO_CALENDAR = /* @__PURE__ */ createIsoCalendar(ISO_CALENDAR_ID, false);

// The Scheduler only uses the ISO calendar: in place of the calendar registry of the Base UI
// version, its copy only implements this calendar (see the notes on the copy in
// `eslint.config.mjs`).
/**
 * Returns the implementation of a calendar: the ISO one.
 */
export function getCalendar(id: unknown): CalendarImplementation {
  if (id === ISO_CALENDAR_ID || (typeof id === 'string' && id.toLowerCase() === ISO_CALENDAR_ID)) {
    return ISO_CALENDAR;
  }
  throw new Error(
    `MUI X Scheduler: The "${String(id)}" calendar isn't supported. ` +
      'The Scheduler has no arithmetic for it, so it cannot create or display its dates. ' +
      'Use the `iso8601` calendar.',
  );
}

type MonthCodesSource = Pick<
  CalendarImplementation,
  'monthCodes' | 'getMonthCodes' | 'constrainMonthCode'
>;

export function getMonthCodes(calendar: MonthCodesSource, year: number) {
  return calendar.getMonthCodes?.(year) ?? calendar.monthCodes;
}

/**
 * Returns the ordinal month of a month code in a year. A code the year doesn't have moves to its
 * replacement when `overflow` is `'constrain'`, and returns `undefined` otherwise.
 */
export function getMonthOfCode(
  calendar: MonthCodesSource,
  year: number,
  monthCode: string,
  overflow: 'constrain' | 'reject',
): number | undefined {
  const codes = getMonthCodes(calendar, year);
  let index = codes.indexOf(monthCode);
  if (index === -1 && overflow === 'constrain' && calendar.constrainMonthCode != null) {
    index = codes.indexOf(calendar.constrainMonthCode(monthCode));
  }
  return index === -1 ? undefined : index + 1;
}

/**
 * Throws when a day is outside the days a calendar supports.
 */
export function checkCalendarRange(calendar: CalendarImplementation, dayNumber: number) {
  if (dayNumber < calendar.firstDay || dayNumber > calendar.lastDay) {
    throw new Error(
      `MUI X Scheduler: A date of the "${calendar.id}" calendar is outside the days it supports, from the ISO date ${formatIsoDate(calendar.firstDay)} to ${formatIsoDate(calendar.lastDay)}. ` +
        "Outside these days, `Intl.DateTimeFormat` doesn't label dates as the Scheduler computes them, or `Date` can't represent them. " +
        'Use a date inside the range.',
    );
  }
}

/**
 * Returns the first day of the month containing `dayNumber`.
 */
export function getCalendarStartOfMonth(calendar: CalendarImplementation, dayNumber: number) {
  return dayNumber - calendar.fromDayNumber(dayNumber).day + 1;
}

/**
 * Reads the `[u-ca=…]` annotation at the end of an ISO string, also in its critical form
 * `[!u-ca=…]`. Returns the string without it.
 */
export function readCalendarAnnotation(text: string): {
  text: string;
  calendar: string | undefined;
} {
  const match = /\[!?u-ca=([a-zA-Z0-9-]+)\]$/.exec(text);
  return match == null
    ? { text, calendar: undefined }
    : { text: text.slice(0, match.index), calendar: match[1] };
}

/**
 * The annotation `toString()` appends to a value of a calendar other than ISO 8601.
 */
export function formatCalendarAnnotation(calendarId: string) {
  return calendarId === ISO_CALENDAR_ID ? '' : `[u-ca=${calendarId}]`;
}
