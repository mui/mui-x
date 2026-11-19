import { PlainDate, createPlainDate, getDayNumber, readDate } from './PlainDate';
import type {
  BaseTemporal as PlainDateTypes,
  PlainDateFields,
  AssignmentOptions,
} from './PlainDate';
import { PlainTime, readTime } from './PlainTime';
import type { BaseTemporal as PlainTimeTypes, PlainTimeFields, PlainTimeInput } from './PlainTime';
import {
  compareOrder,
  formatIsoDate,
  formatIsoTime,
  getTimeNumber,
  readOverflow,
  throwOnPrimitiveConversion,
  TIME_FIELDS,
} from './iso';
import { formatCalendarAnnotation, readCalendarAnnotation } from './calendar';
import { mergeDateFields } from './mergeDateFields';

/**
 * The fields of a date-time: the fields of a date, read in `calendar`, and the fields of a time,
 * which default to 0.
 */
export interface PlainDateTimeFields extends PlainTimeFields, PlainDateFields {}

/**
 * A date-time as its fields, or as a `YYYY-MM-DDTHH:mm` string (`±YYYYYY` for other years than 0
 * to 9999) with optional seconds and an optional `[u-ca=…]` calendar annotation.
 */
export type PlainDateTimeInput = PlainDateTimeFields | string;

/**
 * The fields `with()` replaces, read in the calendar of the value.
 */
export type PlainDateTimeWithFields = Partial<Omit<PlainDateTimeFields, 'calendar'>>;

// Declared apart from the class, like `BaseTemporal.PlainDate`.
export declare namespace BaseTemporal {
  /**
   * A date and time without a timezone, in the ISO calendar or another calendar system. Its date
   * fields are those of `BaseTemporal.PlainDate`.
   */
  class PlainDateTime {
    /**
     * Creates a date-time from its ISO date and its time. Throws an error when they don't form a
     * supported date-time.
     * @param isoYear The year in the ISO calendar.
     * @param isoMonth The month in the ISO calendar, from 1 to 12.
     * @param isoDay The day of the month in the ISO calendar.
     * @param hour The hour, from 0 to 23. Defaults to 0.
     * @param minute The minute, from 0 to 59. Defaults to 0.
     * @param second The second, from 0 to 59. Defaults to 0.
     * @param millisecond The millisecond, from 0 to 999. Defaults to 0.
     * @param microsecond The microsecond, from 0 to 999. Defaults to 0.
     * @param nanosecond The nanosecond, from 0 to 999. Defaults to 0.
     * @param calendar The calendar of the date-time. The date arguments are ISO fields in every
     *   calendar. Defaults to `'iso8601'`.
     */
    constructor(
      isoYear: number,
      isoMonth: number,
      isoDay: number,
      hour?: number | undefined,
      minute?: number | undefined,
      second?: number | undefined,
      millisecond?: number | undefined,
      microsecond?: number | undefined,
      nanosecond?: number | undefined,
      calendar?: string | undefined,
    );
    /**
     * Creates a date-time from another date-time or date, from fields read in their `calendar`, or
     * from a `YYYY-MM-DDTHH:mm` string (`±YYYYYY` for other years than 0 to 9999) with optional
     * seconds and an optional `[u-ca=…]` calendar annotation.
     */
    static from(
      item: PlainDateTime | PlainDateTimeInput,
      options?: AssignmentOptions | undefined,
    ): PlainDateTime;
    /**
     * Returns `-1`, `0` or `1` when `one` is before, the same date and time as, or after `two`,
     * whatever their calendars.
     */
    static compare(
      one: PlainDateTime | PlainDateTimeInput,
      two: PlainDateTime | PlainDateTimeInput,
    ): -1 | 0 | 1;
    /**
     * The calendar of the date-time, such as `'iso8601'` or `'hebrew'`.
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
     * 1 BC.
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
     * The day of the month, from 1.
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
     * The hour, from 0 to 23.
     */
    readonly hour: number;
    /**
     * The minute, from 0 to 59.
     */
    readonly minute: number;
    /**
     * The second, from 0 to 59.
     */
    readonly second: number;
    /**
     * The millisecond, from 0 to 999.
     */
    readonly millisecond: number;
    /**
     * The microsecond, from 0 to 999.
     */
    readonly microsecond: number;
    /**
     * The nanosecond, from 0 to 999.
     */
    readonly nanosecond: number;
    /**
     * Returns whether `other` represents the same date and time in the same calendar.
     */
    equals(other: PlainDateTime | PlainDateTimeInput): boolean;
    /**
     * Returns the date-time with some fields replaced, with the rules of `BaseTemporal.PlainDate`
     * for the date fields.
     */
    with(fields: PlainDateTimeWithFields, options?: AssignmentOptions): PlainDateTime;
    /**
     * Returns the same date at another time, midnight by default.
     */
    withPlainTime(time?: PlainTimeTypes.PlainTime | PlainTimeInput): PlainDateTime;
    /**
     * Returns the same date-time in another calendar.
     */
    withCalendar(calendar: string): PlainDateTime;
    /**
     * Returns the date of the date-time, in the same calendar.
     */
    toPlainDate(): PlainDateTypes.PlainDate;
    /**
     * Returns the time of the date-time.
     */
    toPlainTime(): PlainTimeTypes.PlainTime;
    /**
     * Returns the date-time as a `YYYY-MM-DDTHH:mm:ss` string (`±YYYYYY` for other years than 0 to
     * 9999), followed by the fraction of a second when it isn't 0, and by a `[u-ca=…]` annotation
     * outside the ISO calendar.
     */
    toJSON(): string;
  }
}

// Lets `createPlainDateTime()` skip the checks of the public constructor.
const TRUSTED = Symbol('trusted');

/**
 * A date and time without a timezone, in the ISO calendar or another calendar system.
 */
export class PlainDateTime implements BaseTemporal.PlainDateTime {
  // Private like the internal slots of Temporal, so the value has no own properties.
  /**
   * The date, which holds the calendar and the ISO fields.
   */
  readonly #date: PlainDate;
  readonly #hour: number;
  readonly #minute: number;
  readonly #second: number;
  readonly #millisecond: number;
  readonly #microsecond: number;
  readonly #nanosecond: number;

  constructor(
    isoYear: number,
    isoMonth: number,
    isoDay: number,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    microsecond = 0,
    nanosecond = 0,
    calendar?: string,
    // Passed by `createPlainDateTime()`, with a time it already read.
    validation?: typeof TRUSTED,
    date?: PlainDate,
  ) {
    let time = { hour, minute, second, millisecond, microsecond, nanosecond };
    if (validation !== TRUSTED || date === undefined) {
      date = new PlainDate(isoYear, isoMonth, isoDay, calendar);
      time = readTime(time, { overflow: 'reject' });
    }
    this.#date = date;
    this.#hour = time.hour;
    this.#minute = time.minute;
    this.#second = time.second;
    this.#millisecond = time.millisecond;
    this.#microsecond = time.microsecond;
    this.#nanosecond = time.nanosecond;
    Object.freeze(this);
  }

  get hour(): number {
    return this.#hour;
  }
  get minute(): number {
    return this.#minute;
  }
  get second(): number {
    return this.#second;
  }
  get millisecond(): number {
    return this.#millisecond;
  }
  get microsecond(): number {
    return this.#microsecond;
  }
  get nanosecond(): number {
    return this.#nanosecond;
  }

  get calendarId(): string {
    return this.#date.calendarId;
  }
  get era(): string | undefined {
    return this.#date.era;
  }
  get eraYear(): number | undefined {
    return this.#date.eraYear;
  }
  get year(): number {
    return this.#date.year;
  }
  get month(): number {
    return this.#date.month;
  }
  get monthCode(): string {
    return this.#date.monthCode;
  }
  get day(): number {
    return this.#date.day;
  }
  get dayOfWeek(): number {
    return this.#date.dayOfWeek;
  }
  get daysInMonth(): number {
    return this.#date.daysInMonth;
  }
  get monthsInYear(): number {
    return this.#date.monthsInYear;
  }

  static from(item: PlainDateTimeInput, options?: AssignmentOptions): PlainDateTime {
    const overflow = readOverflow(options, 'PlainDateTime.from()');
    if (item instanceof PlainDateTime) {
      return createPlainDateTime(item.#date, item);
    }
    let date: PlainDate;
    let time: Required<PlainTimeFields>;
    if (typeof item === 'string') {
      const annotated = readCalendarAnnotation(item);
      const match = /^((?:\d{4}|[+-]\d{6})-\d{2}-\d{2})T(.+)$/.exec(annotated.text);
      if (match == null) {
        throw new Error(
          'MUI X Scheduler: The date-time string has an unsupported format. ' +
            "Its date and time cannot be read. Use YYYY-MM-DDTHH:mm, or ±YYYYYY-MM-DDTHH:mm for other years than 0 to 9999, such as '2024-05-24T09:30', without an offset or timezone, optionally followed by a calendar annotation such as '[u-ca=hebrew]'.",
        );
      }
      date = PlainDate.from(
        annotated.calendar == null ? match[1] : `${match[1]}[u-ca=${annotated.calendar}]`,
      );
      time = readTime(match[2], { overflow: 'reject' });
    } else if (item instanceof PlainDate) {
      date = item;
      time = readTime({ hour: 0 });
    } else {
      const { dayNumber, calendar } = readDate(item, overflow, 'PlainDateTime.from()');
      date = createPlainDate(dayNumber, calendar.id);
      time = readTime(TIME_FIELDS.some((key) => item[key] !== undefined) ? item : { hour: 0 }, {
        overflow,
      });
    }
    return createPlainDateTime(date, time);
  }

  static compare(one: PlainDateTimeInput, two: PlainDateTimeInput): -1 | 0 | 1 {
    const a = one instanceof PlainDateTime ? one : PlainDateTime.from(one);
    const b = two instanceof PlainDateTime ? two : PlainDateTime.from(two);
    return (
      compareOrder(getDayNumber(a.#date), getDayNumber(b.#date)) ||
      compareOrder(getTimeNumber(a), getTimeNumber(b))
    );
  }

  equals(other: PlainDateTimeInput): boolean {
    const value = other instanceof PlainDateTime ? other : PlainDateTime.from(other);
    return PlainDateTime.compare(this, value) === 0 && this.calendarId === value.calendarId;
  }
  with(fields: PlainDateTimeWithFields, options?: AssignmentOptions): PlainDateTime {
    return withFields(this, fields, options, 'PlainDateTime.prototype.with()', TIME_FIELDS);
  }
  withPlainTime(time: PlainTimeInput = new PlainTime()): PlainDateTime {
    // A `PlainTime` already holds valid fields.
    return createPlainDateTime(this.#date, time instanceof PlainTime ? time : readTime(time));
  }
  withCalendar(calendar: string): PlainDateTime {
    return createPlainDateTime(this.#date.withCalendar(calendar), this);
  }
  toPlainDate(): PlainDate {
    return this.#date;
  }
  toPlainTime(): PlainTime {
    return PlainTime.from(this);
  }
  toString(): string {
    return `${formatIsoDateTime(this)}${formatCalendarAnnotation(this.calendarId)}`;
  }
  toJSON(): string {
    return this.toString();
  }
  valueOf(): never {
    return throwOnPrimitiveConversion('PlainDateTime');
  }
  get [Symbol.toStringTag](): string {
    return 'Temporal.PlainDateTime';
  }
}

/**
 * Returns `dateTime` with the fields `with()` received replaced. `fieldNames` are the fields of the
 * value besides its date fields, at least one of which `fields` must set without a date field.
 */
export function withFields(
  dateTime: PlainDateTime,
  fields: PlainDateTimeWithFields,
  options: AssignmentOptions | undefined,
  apiName: string,
  fieldNames: readonly string[],
): PlainDateTime {
  const dateFields = mergeDateFields(dateTime.toPlainDate(), fields, apiName, fieldNames);
  const time: PlainTimeFields = {};
  for (const key of TIME_FIELDS) {
    // Like Temporal, only an omitted field keeps its value: `null` reads as 0.
    time[key] = fields[key] === undefined ? dateTime[key] : fields[key];
  }
  return PlainDateTime.from({ ...dateFields, ...time }, options);
}

/**
 * Creates a date-time from a date and a time read by `readTime()`, without checking them again.
 */
export function createPlainDateTime(date: PlainDate, time: Required<PlainTimeFields>) {
  // The constructor takes the ISO fields from `date` and ignores the first three arguments.
  return new PlainDateTime(
    0,
    0,
    0,
    time.hour,
    time.minute,
    time.second,
    time.millisecond,
    time.microsecond,
    time.nanosecond,
    date.calendarId,
    TRUSTED,
    date,
  );
}

/**
 * Formats the ISO fields of a date-time as `YYYY-MM-DDTHH:mm:ss`, without a calendar annotation.
 */
export function formatIsoDateTime(value: PlainDateTime): string {
  return `${formatIsoDate(getDayNumber(value.toPlainDate()))}T${formatIsoTime(value)}`;
}
