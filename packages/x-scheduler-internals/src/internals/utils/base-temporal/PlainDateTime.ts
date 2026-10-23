import {
  PlainDate,
  createPlainDate,
  readDate,
  type BaseTemporal as PlainDateTypes,
  type PlainDateFields,
  type PlainDateFromOptions,
} from './PlainDate';
import {
  PlainTime,
  readTime,
  type BaseTemporal as PlainTimeTypes,
  type PlainTimeFields,
  type PlainTimeInput,
} from './PlainTime';
import {
  compareOrder,
  formatIsoDate,
  formatIsoTime,
  fromDayNumber,
  getTimeNumber,
  readOverflow,
  throwOnPrimitiveConversion,
  TIME_FIELDS,
} from './iso';
import { formatCalendarAnnotation, readCalendarAnnotation } from './calendar';
import { mergeDateFields } from './mergeDateFields';

export interface PlainDateTimeFields extends PlainTimeFields, PlainDateFields {}

export type PlainDateTimeInput = PlainDateTimeFields | string;

// Declared apart from the class, like `BaseTemporal.PlainDate`.
export declare namespace BaseTemporal {
  /**
   * A date and time without a timezone, in the ISO calendar or another calendar system. Its date
   * fields are those of `BaseTemporal.PlainDate`.
   */
  interface PlainDateTime {
    readonly calendarId: string;
    readonly era: string | undefined;
    readonly eraYear: number | undefined;
    readonly year: number;
    readonly month: number;
    readonly monthCode: string;
    readonly day: number;
    readonly dayOfWeek: number;
    readonly daysInMonth: number;
    readonly monthsInYear: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    readonly microsecond: number;
    readonly nanosecond: number;
    /**
     * Returns whether `other` represents the same date and time in the same calendar.
     */
    equals(other: PlainDateTime | PlainDateTimeInput): boolean;
    /**
     * Returns the date-time with some fields replaced, with the rules of `BaseTemporal.PlainDate`
     * for the date fields.
     */
    with(fields: Partial<PlainDateTimeFields>, options?: PlainDateFromOptions): PlainDateTime;
    /**
     * Returns the same date at another time, midnight by default.
     */
    withPlainTime(time?: PlainTimeTypes.PlainTime | PlainTimeInput): PlainDateTime;
    /**
     * Returns the same date-time in another calendar.
     */
    withCalendar(calendar: string): PlainDateTime;
    toPlainDate(): PlainDateTypes.PlainDate;
    toPlainTime(): PlainTimeTypes.PlainTime;
    /**
     * Returns the date-time as a `YYYY-MM-DDTHH:mm:ss` string, followed by the fraction of a second
     * when it isn't 0, and by a `[u-ca=…]` annotation outside the ISO calendar.
     */
    toJSON(): string;
  }
}

export interface PlainDateTimeConstructor {
  new (
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
  ): BaseTemporal.PlainDateTime;
  /**
   * Creates a date-time from another date-time or date, from fields read in their `calendar`, or
   * from a `YYYY-MM-DDTHH:mm` string with optional seconds and an optional `[u-ca=…]` calendar
   * annotation.
   */
  from(
    item: BaseTemporal.PlainDateTime | PlainDateTimeInput,
    options?: PlainDateFromOptions | undefined,
  ): BaseTemporal.PlainDateTime;
  /**
   * Returns `-1`, `0` or `1` when `one` is before, the same as, or after `two`, whatever their
   * calendars.
   */
  compare(
    one: BaseTemporal.PlainDateTime | PlainDateTimeInput,
    two: BaseTemporal.PlainDateTime | PlainDateTimeInput,
  ): -1 | 0 | 1;
}

/**
 * A date and time without a timezone, in the ISO calendar or another calendar system.
 */
export class PlainDateTime implements BaseTemporal.PlainDateTime {
  /**
   * The date, which holds the calendar and the ISO fields.
   */
  declare private readonly date: PlainDate;
  declare readonly hour: number;
  declare readonly minute: number;
  declare readonly second: number;
  declare readonly millisecond: number;
  declare readonly microsecond: number;
  declare readonly nanosecond: number;

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
    date?: PlainDate,
  ) {
    let time = { hour, minute, second, millisecond, microsecond, nanosecond };
    if (date === undefined) {
      date = new PlainDate(isoYear, isoMonth, isoDay, calendar);
      time = readTime(time, { overflow: 'reject' });
    }
    this.date = date;
    this.hour = time.hour;
    this.minute = time.minute;
    this.second = time.second;
    this.millisecond = time.millisecond;
    this.microsecond = time.microsecond;
    this.nanosecond = time.nanosecond;
    Object.freeze(this);
  }

  get calendarId(): string {
    return this.date.calendarId;
  }
  get era(): string | undefined {
    return this.date.era;
  }
  get eraYear(): number | undefined {
    return this.date.eraYear;
  }
  get year(): number {
    return this.date.year;
  }
  get month(): number {
    return this.date.month;
  }
  get monthCode(): string {
    return this.date.monthCode;
  }
  get day(): number {
    return this.date.day;
  }
  get dayOfWeek(): number {
    return this.date.dayOfWeek;
  }
  get daysInMonth(): number {
    return this.date.daysInMonth;
  }
  get monthsInYear(): number {
    return this.date.monthsInYear;
  }

  static from(item: PlainDateTimeInput, options?: PlainDateFromOptions): PlainDateTime {
    const overflow = readOverflow(options, 'PlainDateTime.from()');
    if (item instanceof PlainDateTime) {
      return createPlainDateTime(item.date, item);
    }
    let date: PlainDate;
    let time: Required<PlainTimeFields>;
    if (typeof item === 'string') {
      const annotated = readCalendarAnnotation(item);
      const match = /^(\d{4}-\d{2}-\d{2})T(.+)$/.exec(annotated.text);
      if (match == null) {
        throw new Error(
          'Base UI Plus: The date-time string has an unsupported format. ' +
            "Its date and time cannot be read. Use YYYY-MM-DDTHH:mm, such as '2024-05-24T09:30', without an offset or timezone, optionally followed by a calendar annotation such as '[u-ca=hebrew]'.",
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
      compareOrder(a.date.dayNumber, b.date.dayNumber) ||
      compareOrder(getTimeNumber(a), getTimeNumber(b))
    );
  }

  equals(other: PlainDateTimeInput): boolean {
    const value = other instanceof PlainDateTime ? other : PlainDateTime.from(other);
    return PlainDateTime.compare(this, value) === 0 && this.calendarId === value.calendarId;
  }
  with(fields: Partial<PlainDateTimeFields>, options?: PlainDateFromOptions): PlainDateTime {
    const time: PlainTimeFields = {};
    for (const key of TIME_FIELDS) {
      time[key] = fields[key] ?? this[key];
    }
    return PlainDateTime.from({ ...mergeDateFields(this.date, fields), ...time }, options);
  }
  withPlainTime(time: PlainTimeInput = new PlainTime()): PlainDateTime {
    return createPlainDateTime(this.date, readTime(time));
  }
  withCalendar(calendar: string): PlainDateTime {
    return createPlainDateTime(this.date.withCalendar(calendar), this);
  }
  toPlainDate(): PlainDate {
    return this.date;
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
    date,
  );
}

/**
 * Formats the ISO fields of a date-time as `YYYY-MM-DDTHH:mm:ss`, without a calendar annotation.
 */
export function formatIsoDateTime(value: PlainDateTime): string {
  const isoDate = fromDayNumber(value.toPlainDate().dayNumber);
  return `${formatIsoDate(isoDate.year, isoDate.month, isoDate.day)}T${formatIsoTime(value)}`;
}
