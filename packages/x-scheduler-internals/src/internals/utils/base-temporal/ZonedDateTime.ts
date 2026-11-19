import {
  fail,
  normalizeTimeZone,
  isSameTimeZone,
  getOffset,
  readCachedOffset,
  resolve,
  readZonedOptions,
  formatRoundedOffset,
  MAX_EPOCH_MILLISECONDS,
  NS_PER_MS,
} from '../internals/temporal-utils/zonedDateTime';
import { createPlainDate } from './PlainDate';
import type { PlainDate, BaseTemporal as PlainDateTypes } from './PlainDate';
import {
  compareOrder,
  FIRST_SUPPORTED_DAY,
  LAST_SUPPORTED_DAY,
  MS_PER_DAY,
  readOverflow,
  throwOnPrimitiveConversion,
  TIME_FIELDS,
} from './iso';
import type { PlainTime, BaseTemporal as PlainTimeTypes } from './PlainTime';
import { PlainDateTime, createPlainDateTime, formatIsoDateTime, withFields } from './PlainDateTime';
import type {
  BaseTemporal as PlainDateTimeTypes,
  PlainDateTimeFields,
  PlainDateTimeWithFields,
} from './PlainDateTime';
import {
  checkCalendarRange,
  formatCalendarAnnotation,
  getCalendar,
  ISO_CALENDAR_ID,
  readCalendarAnnotation,
} from './calendar';

const ZONED_FIELDS = [...TIME_FIELDS, 'offset'];

// Passed to the constructor by `createZonedDateTime()`, which reads the instant in milliseconds.
const FROM_MILLISECONDS = Symbol('fromMilliseconds');

/**
 * The options of the `from()` and `with()` methods of `BaseTemporal.ZonedDateTime`.
 */
export interface ZonedDateTimeAssignmentOptions {
  /**
   * How to handle fields out of their range, such as February 30.
   * `'constrain'` adjusts them to the closest valid value. `'reject'` throws an error.
   * Invalid strings always throw an error.
   * @default 'constrain'
   */
  overflow?: 'constrain' | 'reject' | undefined;
  /**
   * Which instant to use when a daylight saving transition skips or repeats the clock time.
   * `'compatible'` moves a skipped time forward and uses the first occurrence of a repeated time.
   * `'earlier'` and `'later'` use the instant before or after the transition. `'reject'` throws an
   * error.
   * @default 'compatible'
   */
  disambiguation?: 'compatible' | 'earlier' | 'later' | 'reject' | undefined;
  /**
   * How to use the offset of the string or of the fields.
   * `'use'` computes the instant from the offset, and `'ignore'` from the timezone.
   * `'prefer'` and `'reject'` use the offset when it's valid in the timezone at this date and
   * time; otherwise, `'prefer'` uses the timezone and `'reject'` throws an error.
   * Defaults to `'reject'` in `from()` and to `'prefer'` in `with()`.
   */
  offset?: 'use' | 'prefer' | 'ignore' | 'reject' | undefined;
}

/**
 * The fields of a zoned date-time: the fields of a date-time, read in `timeZone`.
 */
export interface ZonedDateTimeFields extends PlainDateTimeFields {
  /**
   * The timezone, such as `'Europe/Paris'`.
   */
  timeZone: string;
  /**
   * The offset from UTC, such as `'+02:00'`, which the `offset` option compares with the
   * timezone.
   */
  offset?: string | undefined;
}

// Declared apart from the class, like `BaseTemporal.PlainDate`.
export declare namespace BaseTemporal {
  /**
   * A date and time in a specific timezone, in the ISO calendar or another calendar system. Its date
   * and time fields are those of `BaseTemporal.PlainDateTime`, read in the timezone.
   */
  class ZonedDateTime {
    /**
     * Creates a zoned date-time from an instant. Throws an error when the timezone isn't valid, the
     * instant isn't an instant of `Date`, or its date in the timezone is outside -271821-04-20 to
     * +275760-09-13 or the days its calendar supports.
     * @param epochNanoseconds The nanoseconds since 1970-01-01T00:00Z.
     * @param timeZone The timezone, such as `'Europe/Paris'` or `'+02:00'`.
     * @param calendar The calendar of the date-time. Defaults to `'iso8601'`.
     */
    constructor(epochNanoseconds: bigint, timeZone: string, calendar?: string | undefined);
    /**
     * Creates a zoned date-time from another one, from fields with a `timeZone`, or from a string
     * such as `'2024-05-24T09:30+02:00[Europe/Paris]'`, whose offset is optional.
     */
    static from(
      item: ZonedDateTime | ZonedDateTimeFields | string,
      options?: ZonedDateTimeAssignmentOptions | undefined,
    ): ZonedDateTime;
    /**
     * Returns `-1`, `0` or `1` when `one` is an earlier, the same, or a later instant than `two`.
     */
    static compare(
      one: ZonedDateTime | ZonedDateTimeFields | string,
      two: ZonedDateTime | ZonedDateTimeFields | string,
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
     * The timezone, such as `'Europe/Paris'`.
     */
    readonly timeZoneId: string;
    /**
     * The offset from UTC in the timezone at this instant, such as `'+02:00'`.
     */
    readonly offset: string;
    /**
     * The nanoseconds since 1970-01-01T00:00Z.
     */
    readonly epochNanoseconds: bigint;
    /**
     * The milliseconds since 1970-01-01T00:00Z, rounded down.
     */
    readonly epochMilliseconds: number;
    /**
     * Returns whether `other` represents the same instant in the same timezone and calendar.
     */
    equals(other: ZonedDateTime | ZonedDateTimeFields | string): boolean;
    /**
     * Returns the date-time with some fields replaced in its timezone. The offset is kept when it
     * stays valid.
     */
    with(
      fields: PlainDateTimeWithFields & { offset?: string | undefined },
      options?: ZonedDateTimeAssignmentOptions,
    ): ZonedDateTime;
    /**
     * Returns the same instant in another timezone.
     */
    withTimeZone(timeZone: string): ZonedDateTime;
    /**
     * Returns the same instant in another calendar.
     */
    withCalendar(calendar: string): ZonedDateTime;
    /**
     * Returns the date at this instant in the timezone, in the same calendar.
     */
    toPlainDate(): PlainDateTypes.PlainDate;
    /**
     * Returns the clock time at this instant in the timezone.
     */
    toPlainTime(): PlainTimeTypes.PlainTime;
    /**
     * Returns the date and clock time at this instant in the timezone, without the timezone.
     */
    toPlainDateTime(): PlainDateTimeTypes.PlainDateTime;
    /**
     * Returns the date-time as a string such as `'2024-05-24T09:30:00+02:00[Europe/Paris]'`,
     * followed by a `[u-ca=…]` annotation outside the ISO calendar.
     */
    toJSON(): string;
  }
}

/**
 * A date and time in a specific timezone, in the ISO calendar or another calendar system.
 */
export class ZonedDateTime implements BaseTemporal.ZonedDateTime {
  // Private like the internal slots of Temporal, so the value has no own properties.
  readonly #dateTime: PlainDateTime;
  readonly #offset: string;
  readonly #timeZoneId: string;

  /**
   * The instant, in milliseconds since 1970-01-01T00:00Z, rounded down. The instant is kept as
   * numbers rather than as its `bigint`, which is slow to create and to read the milliseconds of.
   */
  readonly #milliseconds: number;

  /**
   * The nanoseconds of the instant after `#milliseconds`, from 0 to 999,999.
   */
  readonly #nanosecondsInMillisecond: number;

  constructor(
    epochNanoseconds: bigint,
    timeZone: string,
    calendar: string = ISO_CALENDAR_ID,
    source?: typeof FROM_MILLISECONDS,
    // The instant passed by `createZonedDateTime()`, which ignores `epochNanoseconds`.
    epochMilliseconds: number = 0,
    nanosecondsInMillisecond: number = 0,
  ) {
    const fromMilliseconds = source === FROM_MILLISECONDS;
    if (
      typeof timeZone !== 'string' ||
      (fromMilliseconds
        ? !Number.isInteger(epochMilliseconds)
        : typeof epochNanoseconds !== 'bigint')
    ) {
      fail('expected epoch nanoseconds and a timezone');
    }
    let milliseconds = epochMilliseconds;
    let fraction = nanosecondsInMillisecond;
    if (!fromMilliseconds) {
      // One division and one remainder split the instant, rounding toward negative infinity.
      const remainder = Number(epochNanoseconds % NS_PER_MS);
      milliseconds = Number(epochNanoseconds / NS_PER_MS) - (remainder < 0 ? 1 : 0);
      fraction = remainder < 0 ? remainder + 1_000_000 : remainder;
    }
    const normalizedTimeZone = normalizeTimeZone(timeZone);
    // Like Temporal, the calendar is checked before the range.
    const implementation = getCalendar(calendar);
    const offset = getOffset(normalizedTimeZone, milliseconds);
    this.#offset = offset;
    const local = milliseconds + readCachedOffset(offset);
    const dayNumber = Math.floor(local / MS_PER_DAY);
    if (
      // The instants of `Date`, 100,000,000 days on each side of 1970-01-01.
      milliseconds < -MAX_EPOCH_MILLISECONDS ||
      milliseconds > MAX_EPOCH_MILLISECONDS ||
      (milliseconds === MAX_EPOCH_MILLISECONDS && fraction > 0) ||
      dayNumber < FIRST_SUPPORTED_DAY ||
      dayNumber > LAST_SUPPORTED_DAY
    ) {
      throw new Error(
        'MUI X Scheduler: The zoned date-time is outside the supported range. ' +
          'Its instant must be one of the instants of `Date`, and its date must be from -271821-04-20 to +275760-09-13. ' +
          'Use a date-time inside this range.',
      );
    }
    const clock = local - dayNumber * MS_PER_DAY;
    checkCalendarRange(implementation, dayNumber);
    this.#dateTime = createPlainDateTime(createPlainDate(dayNumber, implementation.id), {
      hour: Math.floor(clock / 3600000),
      minute: Math.floor(clock / 60000) % 60,
      second: Math.floor(clock / 1000) % 60,
      millisecond: clock % 1000,
      microsecond: Math.floor(fraction / 1000),
      nanosecond: fraction % 1000,
    });
    this.#milliseconds = milliseconds;
    this.#nanosecondsInMillisecond = fraction;
    this.#timeZoneId = normalizedTimeZone;
    Object.freeze(this);
  }

  static from(
    item: ZonedDateTime | ZonedDateTimeFields | string,
    options?: ZonedDateTimeAssignmentOptions,
  ): ZonedDateTime {
    // Like Temporal, every option is checked, even those the input doesn't use.
    const overflow = readOverflow(options, 'ZonedDateTime.from()');
    readZonedOptions(options);
    // A zoned value, of this or another implementation such as `Temporal`, holds its instant.
    if (
      typeof (item as Partial<BaseTemporal.ZonedDateTime> | null)?.epochNanoseconds === 'bigint'
    ) {
      const { epochNanoseconds, timeZoneId, calendarId } = item as BaseTemporal.ZonedDateTime;
      return new ZonedDateTime(epochNanoseconds, timeZoneId, calendarId);
    }
    if (typeof item === 'string') {
      // The calendar annotation follows the time zone, as in Temporal.
      const annotated = readCalendarAnnotation(item);
      const match =
        /^((?:\d{4}|[+-]\d{6})-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?)(Z|[+-]\d{2}:\d{2}(?::\d{2})?)?\[([^\]=]+)\]$/.exec(
          annotated.text,
        );
      if (!match) {
        return fail(
          'expected an ISO date-time followed by [timezone] and an optional [u-ca=calendar]',
        );
      }
      const dateTime = PlainDateTime.from(
        annotated.calendar == null ? match[1] : `${match[1]}[u-ca=${annotated.calendar}]`,
      );
      return fromDateTime(
        dateTime,
        match[3],
        match[2],
        options,
        /^[-+]\d{2}:\d{2}$/.test(match[2] ?? ''),
      );
    }
    const fields = item as ZonedDateTimeFields;
    return fromDateTime(
      PlainDateTime.from(fields, { overflow }),
      fields.timeZone,
      fields.offset,
      options,
    );
  }

  static compare(
    one: ZonedDateTime | ZonedDateTimeFields | string,
    two: ZonedDateTime | ZonedDateTimeFields | string,
  ): -1 | 0 | 1 {
    const first = one instanceof ZonedDateTime ? one : ZonedDateTime.from(one);
    const second = two instanceof ZonedDateTime ? two : ZonedDateTime.from(two);
    return (
      compareOrder(first.#milliseconds, second.#milliseconds) ||
      compareOrder(first.#nanosecondsInMillisecond, second.#nanosecondsInMillisecond)
    );
  }
  get offset(): string {
    return this.#offset;
  }
  get timeZoneId(): string {
    return this.#timeZoneId;
  }
  get calendarId() {
    return this.#dateTime.calendarId;
  }
  get era() {
    return this.#dateTime.era;
  }
  get eraYear() {
    return this.#dateTime.eraYear;
  }
  get year() {
    return this.#dateTime.year;
  }
  get monthCode() {
    return this.#dateTime.monthCode;
  }
  get daysInMonth() {
    return this.#dateTime.daysInMonth;
  }
  get monthsInYear() {
    return this.#dateTime.monthsInYear;
  }
  get month() {
    return this.#dateTime.month;
  }
  get day() {
    return this.#dateTime.day;
  }
  get dayOfWeek() {
    return this.#dateTime.dayOfWeek;
  }
  get hour() {
    return this.#dateTime.hour;
  }
  get minute() {
    return this.#dateTime.minute;
  }
  get second() {
    return this.#dateTime.second;
  }
  get millisecond() {
    return this.#dateTime.millisecond;
  }
  get microsecond() {
    return this.#dateTime.microsecond;
  }
  get nanosecond() {
    return this.#dateTime.nanosecond;
  }
  get epochMilliseconds() {
    return this.#milliseconds;
  }
  get epochNanoseconds() {
    return BigInt(this.#milliseconds) * NS_PER_MS + BigInt(this.#nanosecondsInMillisecond);
  }
  equals(other: ZonedDateTime | ZonedDateTimeFields | string): boolean {
    const value = other instanceof ZonedDateTime ? other : ZonedDateTime.from(other);
    return (
      this.#milliseconds === value.#milliseconds &&
      this.#nanosecondsInMillisecond === value.#nanosecondsInMillisecond &&
      isSameTimeZone(this.#timeZoneId, value.#timeZoneId) &&
      this.calendarId === value.calendarId
    );
  }
  with(
    fields: PlainDateTimeWithFields & { offset?: string | undefined },
    options?: ZonedDateTimeAssignmentOptions,
  ): ZonedDateTime {
    const dateTime = withFields(
      this.#dateTime,
      fields,
      options,
      'ZonedDateTime.prototype.with()',
      ZONED_FIELDS,
    );
    return fromDateTime(
      dateTime,
      this.#timeZoneId,
      fields.offset === undefined ? this.#offset : fields.offset,
      {
        ...options,
        offset: options?.offset ?? 'prefer',
      },
    );
  }
  withTimeZone(timeZone: string): ZonedDateTime {
    return createZonedDateTime(
      this.#milliseconds,
      timeZone,
      this.calendarId,
      this.#nanosecondsInMillisecond,
    );
  }
  withCalendar(calendar: string): ZonedDateTime {
    return createZonedDateTime(
      this.#milliseconds,
      this.#timeZoneId,
      calendar,
      this.#nanosecondsInMillisecond,
    );
  }
  toPlainDate(): PlainDate {
    return this.#dateTime.toPlainDate();
  }
  toPlainTime(): PlainTime {
    return this.#dateTime.toPlainTime();
  }
  toPlainDateTime(): PlainDateTime {
    return this.#dateTime;
  }
  toString(): string {
    return `${formatIsoDateTime(this.#dateTime)}${formatRoundedOffset(this.#offset)}[${this.#timeZoneId}]${formatCalendarAnnotation(this.calendarId)}`;
  }
  toJSON(): string {
    return this.toString();
  }
  valueOf(): never {
    return throwOnPrimitiveConversion('ZonedDateTime');
  }
  get [Symbol.toStringTag](): string {
    return 'Temporal.ZonedDateTime';
  }
}

/**
 * Creates the zoned date-time of a date-time in a timezone, at the instant `resolve()` returns.
 */
function fromDateTime(
  dateTime: PlainDateTime,
  timeZone: string,
  offset: string | undefined,
  options: ZonedDateTimeAssignmentOptions | undefined,
  matchMinute?: boolean,
): ZonedDateTime {
  return createZonedDateTime(
    resolve(dateTime, timeZone, offset, options, matchMinute),
    timeZone,
    dateTime.calendarId,
    dateTime.microsecond * 1000 + dateTime.nanosecond,
  );
}

/**
 * Creates a zoned date-time from an instant in milliseconds since 1970-01-01T00:00Z, without the
 * `bigint` arithmetic of the constructor, for the code that reads its instants as numbers.
 * `nanosecondsInMillisecond` adds the nanoseconds after the milliseconds, from 0 to 999,999.
 */
export function createZonedDateTime(
  epochMilliseconds: number,
  timeZone: string,
  calendar: string = ISO_CALENDAR_ID,
  nanosecondsInMillisecond: number = 0,
): ZonedDateTime {
  return new ZonedDateTime(
    0n,
    timeZone,
    calendar,
    FROM_MILLISECONDS,
    epochMilliseconds,
    nanosecondsInMillisecond,
  );
}
