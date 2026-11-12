import {
  fail,
  normalizeTimeZone,
  getOffset,
  readCachedOffset,
  epochMilliseconds,
  resolve,
  NS_PER_MS,
} from '../internals/temporal-utils/zonedDateTime';
import { createPlainDate, type PlainDate, type BaseTemporal as PlainDateTypes } from './PlainDate';
import {
  compareOrder,
  FIRST_SUPPORTED_DAY,
  LAST_SUPPORTED_DAY,
  MS_PER_DAY,
  throwOnPrimitiveConversion,
  TIME_FIELDS,
} from './iso';
import type { PlainTime, BaseTemporal as PlainTimeTypes } from './PlainTime';
import {
  PlainDateTime,
  createPlainDateTime,
  formatIsoDateTime,
  withFields,
  type BaseTemporal as PlainDateTimeTypes,
  type PlainDateTimeFields,
  type PlainDateTimeWithFields,
} from './PlainDateTime';
import {
  checkCalendarRange,
  formatCalendarAnnotation,
  getCalendar,
  ISO_CALENDAR_ID,
  readCalendarAnnotation,
} from './calendar';

const ZONED_FIELDS = [...TIME_FIELDS, 'offset'];

// The instants of `Date` and Temporal, 100,000,000 days on each side of 1970-01-01.
const MAX_EPOCH_NANOSECONDS = /* @__PURE__ */ BigInt(LAST_SUPPORTED_DAY * MS_PER_DAY) * NS_PER_MS;

export interface ZonedDateTimeOptions {
  overflow?: 'constrain' | 'reject' | undefined;
  disambiguation?: 'compatible' | 'earlier' | 'later' | 'reject' | undefined;
  offset?: 'use' | 'prefer' | 'ignore' | 'reject' | undefined;
}

export interface ZonedDateTimeFields extends PlainDateTimeFields {
  timeZone: string;
  offset?: string | undefined;
}

// Declared apart from the class, like `BaseTemporal.PlainDate`.
export declare namespace BaseTemporal {
  /**
   * A date and time in a specific timezone, in the ISO calendar or another calendar system. Its date
   * and time fields are those of `BaseTemporal.PlainDateTime`, read in the timezone.
   */
  interface ZonedDateTime {
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
      options?: ZonedDateTimeOptions,
    ): ZonedDateTime;
    /**
     * Returns the same instant in another timezone.
     */
    withTimeZone(timeZone: string): ZonedDateTime;
    /**
     * Returns the same instant in another calendar.
     */
    withCalendar(calendar: string): ZonedDateTime;
    toPlainDate(): PlainDateTypes.PlainDate;
    toPlainTime(): PlainTimeTypes.PlainTime;
    toPlainDateTime(): PlainDateTimeTypes.PlainDateTime;
    /**
     * Returns the date-time as a string such as `'2024-05-24T09:30:00+02:00[Europe/Paris]'`,
     * followed by a `[u-ca=…]` annotation outside the ISO calendar.
     */
    toJSON(): string;
  }
}

export interface ZonedDateTimeConstructor {
  new (
    epochNanoseconds: bigint,
    timeZone: string,
    calendar?: string | undefined,
  ): BaseTemporal.ZonedDateTime;
  /**
   * Creates a zoned date-time from another one, from fields with a `timeZone`, or from a string
   * such as `'2024-05-24T09:30+02:00[Europe/Paris]'`, whose offset is optional.
   */
  from(
    item: BaseTemporal.ZonedDateTime | ZonedDateTimeFields | string,
    options?: ZonedDateTimeOptions | undefined,
  ): BaseTemporal.ZonedDateTime;
  /**
   * Returns `-1`, `0` or `1` when `one` is an earlier, the same, or a later instant than `two`.
   */
  compare(
    one: BaseTemporal.ZonedDateTime | ZonedDateTimeFields | string,
    two: BaseTemporal.ZonedDateTime | ZonedDateTimeFields | string,
  ): -1 | 0 | 1;
}

/**
 * A date and time in a specific timezone, in the ISO calendar or another calendar system.
 */
export class ZonedDateTime implements BaseTemporal.ZonedDateTime {
  declare private readonly dateTime: PlainDateTime;
  declare readonly offset: string;
  declare readonly epochNanoseconds: bigint;
  declare readonly timeZoneId: string;

  constructor(epochNanoseconds: bigint, timeZone: string, calendar: string = ISO_CALENDAR_ID) {
    if (typeof epochNanoseconds !== 'bigint' || typeof timeZone !== 'string') {
      fail('expected epoch nanoseconds and a timezone');
    }
    const normalizedTimeZone = normalizeTimeZone(timeZone);
    // Like Temporal, the calendar is checked before the range.
    const implementation = getCalendar(calendar);
    // One division and one remainder split the instant, rounding toward negative infinity.
    const remainder = Number(epochNanoseconds % NS_PER_MS);
    const milliseconds = Number(epochNanoseconds / NS_PER_MS) - (remainder < 0 ? 1 : 0);
    const fraction = remainder < 0 ? remainder + 1_000_000 : remainder;
    const offset = getOffset(normalizedTimeZone, milliseconds);
    this.offset = offset;
    const local = milliseconds + readCachedOffset(offset);
    const dayNumber = Math.floor(local / MS_PER_DAY);
    if (
      epochNanoseconds < -MAX_EPOCH_NANOSECONDS ||
      epochNanoseconds > MAX_EPOCH_NANOSECONDS ||
      dayNumber < FIRST_SUPPORTED_DAY ||
      dayNumber > LAST_SUPPORTED_DAY
    ) {
      throw new Error(
        'Base UI Plus: The zoned date-time is outside the supported range. ' +
          'Like in Temporal, its instant must be one of the instants of `Date`, and its date must be from -271821-04-20 to +275760-09-13. ' +
          'Use a date-time inside this range.',
      );
    }
    const clock = local - dayNumber * MS_PER_DAY;
    checkCalendarRange(implementation, dayNumber);
    this.dateTime = createPlainDateTime(createPlainDate(dayNumber, implementation.id), {
      hour: Math.floor(clock / 3600000),
      minute: Math.floor(clock / 60000) % 60,
      second: Math.floor(clock / 1000) % 60,
      millisecond: clock % 1000,
      microsecond: Math.floor(fraction / 1000),
      nanosecond: fraction % 1000,
    });
    this.epochNanoseconds = epochNanoseconds;
    this.timeZoneId = normalizedTimeZone;
    Object.freeze(this);
  }

  static from(
    item: ZonedDateTime | ZonedDateTimeFields | string,
    options?: ZonedDateTimeOptions,
  ): ZonedDateTime {
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
      return new ZonedDateTime(
        resolve(dateTime, match[3], match[2], options, /^[-+]\d{2}:\d{2}$/.test(match[2] ?? '')),
        match[3],
        dateTime.calendarId,
      );
    }
    const fields = item as ZonedDateTimeFields;
    const dateTime = PlainDateTime.from(fields, options);
    return new ZonedDateTime(
      resolve(dateTime, fields.timeZone, fields.offset, options),
      fields.timeZone,
      dateTime.calendarId,
    );
  }

  static compare(
    one: ZonedDateTime | ZonedDateTimeFields | string,
    two: ZonedDateTime | ZonedDateTimeFields | string,
  ): -1 | 0 | 1 {
    return compareOrder(
      (one instanceof ZonedDateTime ? one : ZonedDateTime.from(one)).epochNanoseconds,
      (two instanceof ZonedDateTime ? two : ZonedDateTime.from(two)).epochNanoseconds,
    );
  }
  get calendarId() {
    return this.dateTime.calendarId;
  }
  get era() {
    return this.dateTime.era;
  }
  get eraYear() {
    return this.dateTime.eraYear;
  }
  get year() {
    return this.dateTime.year;
  }
  get monthCode() {
    return this.dateTime.monthCode;
  }
  get daysInMonth() {
    return this.dateTime.daysInMonth;
  }
  get monthsInYear() {
    return this.dateTime.monthsInYear;
  }
  get month() {
    return this.dateTime.month;
  }
  get day() {
    return this.dateTime.day;
  }
  get dayOfWeek() {
    return this.dateTime.dayOfWeek;
  }
  get hour() {
    return this.dateTime.hour;
  }
  get minute() {
    return this.dateTime.minute;
  }
  get second() {
    return this.dateTime.second;
  }
  get millisecond() {
    return this.dateTime.millisecond;
  }
  get microsecond() {
    return this.dateTime.microsecond;
  }
  get nanosecond() {
    return this.dateTime.nanosecond;
  }
  get epochMilliseconds() {
    return epochMilliseconds(this.epochNanoseconds);
  }
  equals(other: ZonedDateTime | ZonedDateTimeFields | string): boolean {
    const value = other instanceof ZonedDateTime ? other : ZonedDateTime.from(other);
    return (
      this.epochNanoseconds === value.epochNanoseconds &&
      this.timeZoneId === value.timeZoneId &&
      this.calendarId === value.calendarId
    );
  }
  with(
    fields: PlainDateTimeWithFields & { offset?: string | undefined },
    options?: ZonedDateTimeOptions,
  ): ZonedDateTime {
    const dateTime = withFields(
      this.dateTime,
      fields,
      options,
      'ZonedDateTime.prototype.with()',
      ZONED_FIELDS,
    );
    return new ZonedDateTime(
      resolve(dateTime, this.timeZoneId, fields.offset ?? this.offset, {
        ...options,
        offset: options?.offset ?? 'prefer',
      }),
      this.timeZoneId,
      this.calendarId,
    );
  }
  withTimeZone(timeZone: string): ZonedDateTime {
    return new ZonedDateTime(this.epochNanoseconds, timeZone, this.calendarId);
  }
  withCalendar(calendar: string): ZonedDateTime {
    return new ZonedDateTime(this.epochNanoseconds, this.timeZoneId, calendar);
  }
  toPlainDate(): PlainDate {
    return this.dateTime.toPlainDate();
  }
  toPlainTime(): PlainTime {
    return this.dateTime.toPlainTime();
  }
  toPlainDateTime(): PlainDateTime {
    return this.dateTime;
  }
  toString(): string {
    return `${formatIsoDateTime(this.dateTime)}${this.offset}[${this.timeZoneId}]${formatCalendarAnnotation(this.calendarId)}`;
  }
  toJSON(): string {
    return this.toString();
  }
  valueOf(): never {
    return throwOnPrimitiveConversion('ZonedDateTime');
  }
}
