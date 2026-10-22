import {
  compareOrder,
  formatIsoDate,
  fromDayNumber,
  getIsoDayOfWeek,
  isValidIsoDate,
  readOverflow,
  throwOnPrimitiveConversion,
  toDayNumber,
  toInteger,
} from './iso';
import {
  checkCalendarRange,
  formatCalendarAnnotation,
  getCalendar,
  checkIsoDate,
  getMonthCodes,
  getMonthOfCode,
  ISO_CALENDAR_ID,
  readCalendarAnnotation,
  resolveIsoFields,
  type CalendarImplementation,
} from './calendar';
import { mergeDateFields } from './mergeDateFields';

export { FIRST_SUPPORTED_DAY, LAST_SUPPORTED_DAY } from './iso';
export { addIsoMonths as addMonths, checkIsoDate } from './calendar';

// Declared apart from the class, whose `toString()` and `valueOf()` the API generator cannot handle,
// and inside a namespace, which the API generator uses to name the type in arrays and tuples.
// Methods use the method syntax, whose parameters TypeScript compares in both directions, so
// `Temporal` values stay assignable to this type.
export declare namespace BaseTemporal {
  /**
   * A date without a time or timezone, in the ISO calendar or another calendar system.
   */
  interface PlainDate {
    /**
     * The calendar of the date, such as `'iso8601'` or `'hebrew'`.
     */
    readonly calendarId: string;
    /**
     * The era of the date, such as `'ce'` in the Gregorian calendar, or `undefined` in a calendar
     * without eras, such as `'iso8601'`.
     */
    readonly era: string | undefined;
    /**
     * The year in the era, or `undefined` in a calendar without eras.
     */
    readonly eraYear: number | undefined;
    /**
     * The year in the calendar, which keeps counting down before its first era: the ISO year 0 is
     * 1 BC. ISO years go from 0 to 9999, and calendar grids may include disabled days in years -1
     * and 10000.
     */
    readonly year: number;
    /**
     * The position of the month in its year, from 1. Years of some calendars have 13 months.
     */
    readonly month: number;
    /**
     * Identifies the month in every year, such as `'M05L'` for Adar I, the month Hebrew leap years
     * add before Adar (`'M06'`).
     */
    readonly monthCode: string;
    /**
     * The day of the month, starting at 1.
     */
    readonly day: number;
    /**
     * The day of the week, from 1 for Monday to 7 for Sunday, regardless of the locale.
     */
    readonly dayOfWeek: number;
    /**
     * The number of days in the month.
     */
    readonly daysInMonth: number;
    /**
     * The number of months in the year.
     */
    readonly monthsInYear: number;
    /**
     * Returns the date moved by a duration in its calendar, like Temporal. Years keep the month
     * code, or move to the month that replaces it in a year without it, and months count the
     * months of each year. The day is then constrained to the month, or rejected with
     * `overflow: 'reject'`. Weeks and days come last.
     */
    add(duration: PlainDateDuration, options?: PlainDateFromOptions): PlainDate;
    /**
     * Returns the date with some fields replaced, like Temporal. A month replaces the month code
     * and the other way around, a year keeps the month code, and a year replaces the era and the
     * year of era and the other way around.
     */
    with(fields: PlainDateWithFields, options?: PlainDateFromOptions): PlainDate;
    /**
     * Returns whether `other` represents the same date in the same calendar.
     */
    equals(other: PlainDate | PlainDateFields | string): boolean;
    /**
     * Returns the same date in another calendar.
     */
    withCalendar(calendar: string): PlainDate;
    /**
     * Returns the date as a `YYYY-MM-DD` string, followed by a `[u-ca=…]` annotation outside the
     * ISO calendar.
     */
    toJSON(): string;
  }
}

/**
 * The fields of a date, read in `calendar`, which defaults to the ISO calendar.
 * Pass a year, or an era and a year of era, a month or a month code, and a day.
 */
export interface PlainDateFields {
  /**
   * The calendar the other fields are read in.
   * @default 'iso8601'
   */
  calendar?: string | undefined;
  year?: number | undefined;
  era?: string | undefined;
  eraYear?: number | undefined;
  month?: number | undefined;
  monthCode?: string | undefined;
  day: number;
}

/**
 * The fields `with()` replaces, read in the calendar of the date.
 */
export type PlainDateWithFields = Partial<Omit<PlainDateFields, 'calendar'>>;

/**
 * A duration in years, months, weeks and days, as `add()` reads it. Its units are integers with
 * the same sign.
 */
export interface PlainDateDuration {
  years?: number | undefined;
  months?: number | undefined;
  weeks?: number | undefined;
  days?: number | undefined;
}

export interface PlainDateConstructor {
  new (
    isoYear: number,
    isoMonth: number,
    isoDay: number,
    calendar?: string | undefined,
  ): BaseTemporal.PlainDate;
  /**
   * Creates a date from another date, from fields read in their `calendar`, or from a
   * `YYYY-MM-DD` string with an optional `[u-ca=…]` calendar annotation.
   */
  from(
    item: BaseTemporal.PlainDate | PlainDateFields | string,
    options?: PlainDateFromOptions | undefined,
  ): BaseTemporal.PlainDate;
  /**
   * Returns `-1`, `0` or `1` when `one` is before, the same day as, or after `two`, whatever their
   * calendars.
   */
  compare(
    one: BaseTemporal.PlainDate | PlainDateFields | string,
    two: BaseTemporal.PlainDate | PlainDateFields | string,
  ): -1 | 0 | 1;
}

export interface PlainDateFromOptions {
  /**
   * How to handle out-of-range parts when creating a value from an object.
   * `'constrain'` adjusts parts where possible. `'reject'` throws an error.
   * Invalid strings always throw an error.
   * @default 'constrain'
   */
  overflow?: 'constrain' | 'reject' | undefined;
}

type PlainDateItem = PlainDateFields | string;

/**
 * Returns the first day of the ISO month containing `dayNumber`.
 */
export function getStartOfMonth(dayNumber: number): number {
  return dayNumber - fromDayNumber(dayNumber).day + 1;
}

/**
 * Returns the first day of the week containing `dayNumber`. Weekdays use ISO numbering.
 */
export function getStartOfWeek(dayNumber: number, firstDayOfWeek: number): number {
  return dayNumber - getWeekDayIndex(getIsoDayOfWeek(dayNumber), firstDayOfWeek);
}

/**
 * Returns the zero-based weekday index relative to `firstDayOfWeek`.
 * Weekdays use ISO numbering, with 0 also accepted for Sunday.
 */
export function getWeekDayIndex(dayOfWeek: number, firstDayOfWeek: number): number {
  return (dayOfWeek - firstDayOfWeek + 7) % 7;
}

/**
 * Allows calendar grids to include disabled days outside the supported years.
 */
const UNVALIDATED = Symbol('unvalidated');

const ISO_DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * The units of a Temporal duration, in the order Temporal reads them.
 */
const DURATION_UNITS = [
  'days',
  'hours',
  'microseconds',
  'milliseconds',
  'minutes',
  'months',
  'nanoseconds',
  'seconds',
  'weeks',
  'years',
] as const;

const WITH_FIELDS = ['year', 'era', 'eraYear', 'month', 'monthCode', 'day'] as const;

/**
 * More years than the supported days span in any calendar.
 */
const MAX_YEARS = 20_000;

/**
 * Reads a duration like Temporal. Its time units must be 0.
 */
function readDuration(duration: PlainDateDuration): Required<PlainDateDuration> {
  if (typeof duration !== 'object' || duration === null) {
    throw new TypeError(
      `Base UI Plus: \`BaseTemporal.PlainDate.prototype.add()\` received ${String(duration)}, which isn't a duration. ` +
        "`add()` can't read years, months, weeks or days from it. " +
        'Pass an object such as `{ months: 1, days: 2 }`. Duration strings such as `"P1M"` are not supported.',
    );
  }
  const units: Required<PlainDateDuration> = { days: 0, months: 0, weeks: 0, years: 0 };
  let hasUnit = false;
  let hasTimeUnit = false;
  for (const unit of DURATION_UNITS) {
    const value = (duration as Record<string, unknown>)[unit];
    if (value !== undefined) {
      // Unlike `Number()`, `+` throws on a BigInt, like Temporal.
      const number = +(value as number);
      if (!Number.isInteger(number)) {
        throw new Error(
          `Base UI Plus: \`BaseTemporal.PlainDate.prototype.add()\` received ${String(value)} as the ${unit} of a duration, which isn't an integer. ` +
            'A duration moves a date by whole units. ' +
            'Pass integers, such as `{ months: 1 }`.',
        );
      }
      hasUnit = true;
      if (unit === 'days' || unit === 'months' || unit === 'weeks' || unit === 'years') {
        units[unit] = number;
      } else if (number !== 0) {
        hasTimeUnit = true;
      }
    }
  }
  if (!hasUnit) {
    throw new TypeError(
      'Base UI Plus: `BaseTemporal.PlainDate.prototype.add()` received a duration without years, months, weeks or days. ' +
        "`add()` can't tell how far to move the date. " +
        'Pass at least one of these units, such as `{ days: 1 }`.',
    );
  }
  if (hasTimeUnit) {
    throw new Error(
      'Base UI Plus: `BaseTemporal.PlainDate.prototype.add()` received a duration with time units. ' +
        "A date has no time, and `add()` doesn't turn time units into days. " +
        'Pass whole days instead, such as `{ days: 2 }` for 48 hours.',
    );
  }
  const { days, months, weeks, years } = units;
  if (Math.min(days, months, weeks, years) < 0 && Math.max(days, months, weeks, years) > 0) {
    throw new Error(
      'Base UI Plus: `BaseTemporal.PlainDate.prototype.add()` received a duration with positive and negative units. ' +
        'A duration moves a date in a single direction. ' +
        'Pass units with the same sign, or call `add()` once per direction.',
    );
  }
  return units;
}

/**
 * Returns the day number of `date` moved by years and months in `calendar`, like Temporal: the
 * years keep the month code, the months count the months of each year, and the day is regulated
 * once, in the month they reach.
 */
function addYearsAndMonths(
  calendar: CalendarImplementation,
  date: PlainDate,
  years: number,
  months: number,
  overflow: 'constrain' | 'reject',
): number {
  // Bounds the loops below: longer durations leave the supported days anyway.
  let year = date.year + Math.max(-MAX_YEARS, Math.min(years, MAX_YEARS));
  const monthOfCode = getMonthOfCode(calendar, year, date.monthCode, overflow);
  if (monthOfCode === undefined) {
    throw new Error(
      `Base UI Plus: \`BaseTemporal.PlainDate.prototype.add()\` moved a date of the month ${date.monthCode} to the year ${year}, which doesn't have this month. ` +
        "The `overflow: 'reject'` option forbids moving the date to another month. " +
        "Pass `overflow: 'constrain'` to use the month that replaces it.",
    );
  }
  let month = monthOfCode + Math.max(-13 * MAX_YEARS, Math.min(months, 13 * MAX_YEARS));
  while (month < 1) {
    year -= 1;
    month += getMonthCodes(calendar, year).length;
  }
  for (
    let monthsInYear = getMonthCodes(calendar, year).length;
    month > monthsInYear;
    monthsInYear = getMonthCodes(calendar, year).length
  ) {
    month -= monthsInYear;
    year += 1;
  }
  const daysInMonth = calendar.getDaysInMonth(year, month);
  if (date.day > daysInMonth && overflow === 'reject') {
    throw new Error(
      `Base UI Plus: \`BaseTemporal.PlainDate.prototype.add()\` moved the day ${date.day} to a month of ${daysInMonth} days. ` +
        "The `overflow: 'reject'` option forbids moving the date to the last day of the month. " +
        "Pass `overflow: 'constrain'` to use the last day of the month.",
    );
  }
  return calendar.toDayNumber(year, month, Math.min(date.day, daysInMonth));
}

/**
 * A date without a time or timezone, in the ISO calendar or another calendar system.
 */
export class PlainDate implements BaseTemporal.PlainDate {
  declare public readonly calendarId: string;

  declare public readonly era: string | undefined;

  declare public readonly eraYear: number | undefined;

  declare public readonly year: number;

  declare public readonly month: number;

  declare public readonly monthCode: string;

  declare public readonly day: number;

  declare public readonly dayOfWeek: number;

  /**
   * The ISO fields of the date, which the calendar fields above can't replace. Omitted from the
   * public type.
   */
  declare public readonly isoYear: number;

  declare public readonly isoMonth: number;

  declare public readonly isoDay: number;

  /**
   * The number of days since 1970-01-01. Omitted from the public type.
   */
  declare public readonly dayNumber: number;

  constructor(
    isoYear: number,
    isoMonth: number,
    isoDay: number,
    calendar: string = ISO_CALENDAR_ID,
    validation?: typeof UNVALIDATED,
  ) {
    const year = toInteger(isoYear, 'year');
    const month = toInteger(isoMonth, 'month');
    const day = toInteger(isoDay, 'day');
    const implementation = getCalendar(calendar);
    if (validation !== UNVALIDATED) {
      checkIsoDate(year, month, day);
    }
    const dayNumber = toDayNumber(year, month, day);
    if (validation !== UNVALIDATED) {
      checkCalendarRange(implementation, dayNumber);
    }
    this.calendarId = implementation.id;
    this.isoYear = year;
    this.isoMonth = month;
    this.isoDay = day;
    if (implementation.id === ISO_CALENDAR_ID) {
      this.year = year;
      this.month = month;
      this.day = day;
      this.monthCode = implementation.monthCodes[month - 1];
    } else {
      const date = implementation.getDate(dayNumber);
      this.era = date.era;
      this.eraYear = date.eraYear;
      this.year = date.year;
      this.month = date.month;
      this.day = date.day;
      this.monthCode = date.monthCode;
    }
    this.dayOfWeek = getIsoDayOfWeek(dayNumber);
    this.dayNumber = dayNumber;
    Object.freeze(this);
  }

  public get daysInMonth(): number {
    return getCalendar(this.calendarId).getDaysInMonth(this.year, this.month);
  }

  public get monthsInYear(): number {
    return getMonthCodes(getCalendar(this.calendarId), this.year).length;
  }

  /**
   * Creates a date from another date, from fields read in their `calendar`, or from a
   * `YYYY-MM-DD` string with an optional `[u-ca=…]` calendar annotation.
   */
  public static from(item: PlainDateItem, options?: PlainDateFromOptions): PlainDate {
    const overflow = readOverflow(options, 'PlainDate.from()');
    if (item instanceof PlainDate) {
      return createPlainDate(item.dayNumber, item.calendarId);
    }
    const { dayNumber, calendar } = readDate(item, overflow, 'PlainDate.from()');
    return createPlainDate(dayNumber, calendar.id);
  }

  /**
   * Returns `-1`, `0` or `1` when `one` is before, the same day as, or after `two`, whatever their
   * calendars.
   */
  public static compare(one: PlainDateItem, two: PlainDateItem): -1 | 0 | 1 {
    return compareOrder(getItemDayNumber(one), getItemDayNumber(two));
  }

  /**
   * Returns the date moved by a duration in its calendar, like Temporal. Years keep the month
   * code, or move to the month that replaces it in a year without it, and months count the
   * months of each year. The day is then constrained to the month, or rejected with
   * `overflow: 'reject'`. Weeks and days come last.
   */
  public add(duration: PlainDateDuration, options?: PlainDateFromOptions): PlainDate {
    const { years, months, weeks, days } = readDuration(duration);
    const overflow = readOverflow(options, 'PlainDate.prototype.add()');
    const calendar = getCalendar(this.calendarId);
    let dayNumber = this.dayNumber;
    if (years !== 0 || months !== 0) {
      dayNumber = addYearsAndMonths(calendar, this, years, months, overflow);
    }
    dayNumber += weeks * 7 + days;
    checkCalendarRange(calendar, dayNumber);
    return createPlainDate(dayNumber, calendar.id);
  }

  /**
   * Returns the date with some fields replaced, like Temporal. A month replaces the month code
   * and the other way around, a year keeps the month code, and a year replaces the era and the
   * year of era and the other way around.
   */
  public with(fields: PlainDateWithFields, options?: PlainDateFromOptions): PlainDate {
    const apiName = 'PlainDate.prototype.with()';
    if (
      typeof fields !== 'object' ||
      fields === null ||
      ['calendar', 'calendarId', 'timeZone'].some(
        (key) => (fields as Record<string, unknown>)[key] !== undefined,
      )
    ) {
      throw new TypeError(
        `Base UI Plus: \`BaseTemporal.${apiName}\` received ${String(fields)}, which isn't an object of date fields. ` +
          '`with()` replaces the date fields of an object, and keeps the calendar of the date, so it rejects temporal values and objects with a calendar or a time zone. ' +
          'Pass the fields to replace, such as `{ day: 1 }`, and call `withCalendar()` to change the calendar.',
      );
    }
    // Like Temporal, a calendar without eras ignores the era fields.
    const partial: PlainDateWithFields = { ...fields };
    if (getCalendar(this.calendarId).getYearFromEra == null) {
      partial.era = undefined;
      partial.eraYear = undefined;
    }
    if (WITH_FIELDS.every((field) => partial[field] === undefined)) {
      throw new TypeError(
        `Base UI Plus: \`BaseTemporal.${apiName}\` received no date field the calendar of the date reads. ` +
          "`with()` can't tell which fields to replace. " +
          'Pass at least one of `year`, `month`, `monthCode` and `day`, or `era` and `eraYear` outside the ISO calendar.',
      );
    }
    return createPlainDate(
      readDate(mergeDateFields(this, partial), readOverflow(options, apiName), apiName).dayNumber,
      this.calendarId,
    );
  }

  /**
   * Returns whether `other` represents the same date in the same calendar.
   */
  public equals(other: PlainDateItem): boolean {
    const date = PlainDate.from(other);
    return date.dayNumber === this.dayNumber && date.calendarId === this.calendarId;
  }

  /**
   * Returns the same date in another calendar.
   */
  public withCalendar(calendar: string): PlainDate {
    return new PlainDate(this.isoYear, this.isoMonth, this.isoDay, calendar);
  }

  public toString(): string {
    return `${formatIsoDate(this.isoYear, this.isoMonth, this.isoDay)}${formatCalendarAnnotation(this.calendarId)}`;
  }

  public toJSON(): string {
    return this.toString();
  }

  public valueOf(): never {
    return throwOnPrimitiveConversion('PlainDate');
  }
}

/**
 * Creates a date from a day number, which may be outside the supported days, as calendar grids
 * show around them.
 */
export function createPlainDate(dayNumber: number, calendar: string): PlainDate {
  const { year, month, day } = fromDayNumber(dayNumber);
  return new PlainDate(year, month, day, calendar, UNVALIDATED);
}

/**
 * Returns the day number of a date object, interpreting its fields in its `calendarId`.
 * Rejects strings and non-integer date parts.
 */
export function getDayNumber(day: PlainDateFields): number {
  if (day instanceof PlainDate) {
    return day.dayNumber;
  }
  if (
    typeof day !== 'object' ||
    day === null ||
    ![day.year, day.month, day.day].every(Number.isInteger)
  ) {
    throw new TypeError(
      `Base UI Plus: A calendar received ${String(day)} where it expects a \`PlainDate\`. ` +
        "The calendar reads the year, the month and the day of each date, so it can't use this one. " +
        'Create dates with `BaseTemporal.PlainDate.from()`. A Server Component sends a `PlainDate` to the client as its string: pass that string to `from()` in a Client Component.',
    );
  }
  return readDate(day, 'constrain', 'PlainDate.from()').dayNumber;
}

/**
 * Returns the calendar of a temporal object or a set of fields: its `calendar` field, then the
 * `calendarId` of a temporal value, then the ISO calendar.
 */
export function getItemCalendar(item: object): CalendarImplementation {
  const { calendar, calendarId } = item as { calendar?: unknown; calendarId?: unknown };
  return getCalendar(calendar ?? calendarId ?? ISO_CALENDAR_ID);
}

/**
 * Reads a date from fields or an ISO string, without constructing a `PlainDate`.
 * Throws for invalid dates and dates outside the calendar's supported days.
 */
export function readDate(
  item: PlainDateItem,
  overflow: 'constrain' | 'reject',
  apiName: string,
): { dayNumber: number; calendar: CalendarImplementation } {
  if (typeof item === 'string') {
    const annotated = readCalendarAnnotation(item);
    const match = ISO_DATE_REGEXP.exec(annotated.text);
    const year = Number(match?.[1]);
    const month = Number(match?.[2]);
    const day = Number(match?.[3]);
    if (match == null || !isValidIsoDate(year, month, day)) {
      throw new Error(
        `Base UI Plus: \`BaseTemporal.PlainDate.from()\` received ${JSON.stringify(item)}, which isn't an existing date in the \`YYYY-MM-DD\` format. ` +
          'Other ISO 8601 forms, such as times, offsets, time zone annotations or 6-digit years, are not supported. ' +
          "Pass a date such as `'2024-05-24'`, optionally followed by a calendar annotation such as `'[u-ca=hebrew]'`.",
      );
    }
    const calendar = getCalendar(annotated.calendar ?? ISO_CALENDAR_ID);
    const dayNumber = toDayNumber(year, month, day);
    checkCalendarRange(calendar, dayNumber);
    return { dayNumber, calendar };
  }
  if (typeof item !== 'object' || item === null) {
    throw new TypeError(
      `Base UI Plus: \`BaseTemporal.PlainDate.from()\` received ${String(item)}, which isn't a date. ` +
        "`from()` can't read a year, a month and a day from it. " +
        "Pass a `PlainDate`, an object such as `{ year: 2024, month: 5, day: 24 }`, or a string such as `'2024-05-24'`.",
    );
  }
  const calendar = getItemCalendar(item);
  const dayNumber =
    calendar.resolveFields?.(item, overflow, apiName) ??
    resolveIsoFields(calendar, item, overflow, apiName);
  checkCalendarRange(calendar, dayNumber);
  return { dayNumber, calendar };
}

function getItemDayNumber(item: PlainDateItem) {
  if (item instanceof PlainDate) {
    return item.dayNumber;
  }
  return readDate(item, 'constrain', 'PlainDate.compare()').dayNumber;
}

/**
 * Caches one `PlainDate` instance per day for a calendar grid, in the calendar it displays.
 */
export class PlainDateCache {
  private readonly dates = new Map<number, PlainDate>();

  declare public readonly calendarId: string;

  constructor(calendarId: string = ISO_CALENDAR_ID) {
    this.calendarId = calendarId;
  }

  public get(dayNumber: number): PlainDate {
    let date = this.dates.get(dayNumber);
    if (date === undefined) {
      date = createPlainDate(dayNumber, this.calendarId);
      this.dates.set(dayNumber, date);
    }
    return date;
  }
}
