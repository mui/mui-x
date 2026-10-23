import type { PlainDateFromOptions } from './PlainDate';
import {
  compareOrder,
  formatIsoTime,
  getTimeNumber,
  ISO_TIME_REGEXP,
  readOverflow,
  throwOnPrimitiveConversion,
  TIME_FIELD_MAXIMUMS,
  TIME_FIELDS,
  toInteger,
} from './iso';

export interface PlainTimeFields {
  hour?: number | undefined;
  minute?: number | undefined;
  second?: number | undefined;
  millisecond?: number | undefined;
  microsecond?: number | undefined;
  nanosecond?: number | undefined;
}

export type PlainTimeInput = PlainTimeFields | string;

/**
 * Reads and validates time parts without applying a timezone.
 */
export function readTime(
  item: PlainTimeInput,
  options?: PlainDateFromOptions,
): Required<PlainTimeFields> {
  let fields: PlainTimeFields;
  let overflow = readOverflow(options, 'PlainTime.from()');
  if (typeof item === 'string') {
    const match = ISO_TIME_REGEXP.exec(item);
    if (match == null) {
      throw new Error(
        'Base UI Plus: The time string has an unsupported format. ' +
          'Its clock fields cannot be read. Use HH:mm or HH:mm:ss with up to nine fractional digits.',
      );
    }
    const fraction = (match[4] ?? '').padEnd(9, '0');
    fields = {
      hour: Number(match[1]),
      minute: Number(match[2]),
      second: Number(match[3] ?? 0),
      millisecond: Number(fraction.slice(0, 3)),
      microsecond: Number(fraction.slice(3, 6)),
      nanosecond: Number(fraction.slice(6, 9)),
    };
    overflow = 'reject';
  } else {
    if (
      item == null ||
      typeof item !== 'object' ||
      !TIME_FIELDS.some((key) => item[key] !== undefined)
    ) {
      throw new TypeError(
        'Base UI Plus: The time has no clock fields. ' +
          "A clock time cannot be created. Pass a string such as '09:30' or an object such as { hour: 9, minute: 30 }.",
      );
    }
    fields = item;
  }
  const result = { hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
  for (const field of TIME_FIELDS) {
    let value = toInteger(fields[field] ?? 0, field);
    const maximum = TIME_FIELD_MAXIMUMS[field];
    if (overflow === 'constrain') {
      value = Math.max(0, Math.min(value, maximum));
    } else if (value < 0 || value > maximum) {
      throw new Error(
        `Base UI Plus: The ${field} of the time is out of range. ` +
          `The clock time cannot be created. Pass an integer between 0 and ${maximum}.`,
      );
    }
    result[field] = value;
  }
  return result;
}

// Declared apart from the class, like `BaseTemporal.PlainDate`.
export declare namespace BaseTemporal {
  /**
   * A time without a date or timezone.
   */
  interface PlainTime {
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
    readonly microsecond: number;
    readonly nanosecond: number;
    /**
     * Returns whether `other` represents the same time.
     */
    equals(other: PlainTime | PlainTimeInput): boolean;
    /**
     * Returns the time with some fields replaced.
     */
    with(fields: PlainTimeFields, options?: PlainDateFromOptions): PlainTime;
    /**
     * Returns the time as an `HH:mm:ss` string, followed by the fraction of a second when it isn't 0.
     */
    toJSON(): string;
  }
}

export interface PlainTimeConstructor {
  new (
    hour?: number | undefined,
    minute?: number | undefined,
    second?: number | undefined,
    millisecond?: number | undefined,
    microsecond?: number | undefined,
    nanosecond?: number | undefined,
  ): BaseTemporal.PlainTime;
  /**
   * Creates a time from another time, from its fields, or from an `HH:mm` or `HH:mm:ss` string
   * with up to nine fractional digits.
   */
  from(
    item: BaseTemporal.PlainTime | PlainTimeInput,
    options?: PlainDateFromOptions | undefined,
  ): BaseTemporal.PlainTime;
  /**
   * Returns `-1`, `0` or `1` when `one` is before, the same time as, or after `two`.
   */
  compare(
    one: BaseTemporal.PlainTime | PlainTimeInput,
    two: BaseTemporal.PlainTime | PlainTimeInput,
  ): -1 | 0 | 1;
}

/**
 * A time without a date or timezone.
 */
export class PlainTime implements BaseTemporal.PlainTime {
  declare readonly hour: number;
  declare readonly minute: number;
  declare readonly second: number;
  declare readonly millisecond: number;
  declare readonly microsecond: number;
  declare readonly nanosecond: number;

  constructor(hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    const fields = readTime(
      { hour, minute, second, millisecond, microsecond, nanosecond },
      { overflow: 'reject' },
    );
    this.hour = fields.hour;
    this.minute = fields.minute;
    this.second = fields.second;
    this.millisecond = fields.millisecond;
    this.microsecond = fields.microsecond;
    this.nanosecond = fields.nanosecond;
    Object.freeze(this);
  }

  static from(item: PlainTimeInput, options?: PlainDateFromOptions): PlainTime {
    const fields = readTime(item, options);
    return new PlainTime(
      fields.hour,
      fields.minute,
      fields.second,
      fields.millisecond,
      fields.microsecond,
      fields.nanosecond,
    );
  }

  static compare(one: PlainTimeInput, two: PlainTimeInput): -1 | 0 | 1 {
    return compareOrder(
      getTimeNumber(one instanceof PlainTime ? one : readTime(one)),
      getTimeNumber(two instanceof PlainTime ? two : readTime(two)),
    );
  }

  equals(other: PlainTimeInput): boolean {
    return PlainTime.compare(this, other) === 0;
  }

  with(fields: PlainTimeFields, options?: PlainDateFromOptions): PlainTime {
    return PlainTime.from(mergeDefinedFields<PlainTimeFields>(this, fields), options);
  }

  toString(): string {
    return formatIsoTime(this);
  }
  toJSON(): string {
    return this.toString();
  }
  valueOf(): never {
    return throwOnPrimitiveConversion('PlainTime');
  }
}

/**
 * Keeps existing fields when an update is omitted or `undefined`.
 */
export function mergeDefinedFields<T extends object>(current: T, fields: Partial<T>): T {
  const next = { ...current };
  for (const key of Object.keys(fields) as (keyof T)[]) {
    const value = fields[key];
    if (value !== undefined) {
      next[key] = value;
    }
  }
  return next;
}
