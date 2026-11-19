import type { AssignmentOptions } from './PlainDate';
import {
  compareOrder,
  formatIsoTime,
  getTimeNumber,
  ISO_TIME_REGEXP,
  readOverflow,
  readWithFields,
  throwOnPrimitiveConversion,
  TIME_FIELD_MAXIMUMS,
  TIME_FIELDS,
  toInteger,
} from './iso';

/**
 * The fields of a time. `from()` needs at least one of them and sets the others to 0, while
 * `with()` keeps the ones it doesn't receive.
 */
export interface PlainTimeFields {
  /**
   * The hour, from 0 to 23.
   */
  hour?: number | undefined;
  /**
   * The minute, from 0 to 59.
   */
  minute?: number | undefined;
  /**
   * The second, from 0 to 59.
   */
  second?: number | undefined;
  /**
   * The millisecond, from 0 to 999.
   */
  millisecond?: number | undefined;
  /**
   * The microsecond, from 0 to 999.
   */
  microsecond?: number | undefined;
  /**
   * The nanosecond, from 0 to 999.
   */
  nanosecond?: number | undefined;
}

/**
 * A time as its fields, or as an `HH:mm` or `HH:mm:ss` string with up to nine fractional digits.
 */
export type PlainTimeInput = PlainTimeFields | string;

/**
 * Reads and validates time parts without applying a timezone.
 */
export function readTime(
  item: PlainTimeInput,
  options?: AssignmentOptions,
): Required<PlainTimeFields> {
  let fields: PlainTimeFields;
  let overflow = readOverflow(options, 'PlainTime.from()');
  if (typeof item === 'string') {
    const match = ISO_TIME_REGEXP.exec(item);
    if (match == null) {
      throw new Error(
        'MUI X Scheduler: The time string has an unsupported format. ' +
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
        'MUI X Scheduler: The time has no clock fields. ' +
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
        `MUI X Scheduler: The ${field} of the time is out of range. ` +
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
  class PlainTime {
    /**
     * Creates a time from its fields. Throws an error when one is out of its range.
     * @param hour The hour, from 0 to 23. Defaults to 0.
     * @param minute The minute, from 0 to 59. Defaults to 0.
     * @param second The second, from 0 to 59. Defaults to 0.
     * @param millisecond The millisecond, from 0 to 999. Defaults to 0.
     * @param microsecond The microsecond, from 0 to 999. Defaults to 0.
     * @param nanosecond The nanosecond, from 0 to 999. Defaults to 0.
     */
    constructor(
      hour?: number | undefined,
      minute?: number | undefined,
      second?: number | undefined,
      millisecond?: number | undefined,
      microsecond?: number | undefined,
      nanosecond?: number | undefined,
    );
    /**
     * Creates a time from another time, from its fields, or from an `HH:mm` or `HH:mm:ss` string
     * with up to nine fractional digits.
     */
    static from(
      item: PlainTime | PlainTimeInput,
      options?: AssignmentOptions | undefined,
    ): PlainTime;
    /**
     * Returns `-1`, `0` or `1` when `one` is before, the same time as, or after `two`.
     */
    static compare(one: PlainTime | PlainTimeInput, two: PlainTime | PlainTimeInput): -1 | 0 | 1;
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
    // Date-times have every other member of a time, so this keeps them out of the APIs that take
    // a time, such as the time field.
    /**
     * Always `undefined`: a time has no date.
     */
    readonly year?: undefined;
    /**
     * Returns whether `other` represents the same time.
     */
    equals(other: PlainTime | PlainTimeInput): boolean;
    /**
     * Returns the time with some fields replaced.
     */
    with(fields: PlainTimeFields, options?: AssignmentOptions): PlainTime;
    /**
     * Returns the time as an `HH:mm:ss` string, followed by the fraction of a second when it isn't 0.
     */
    toJSON(): string;
  }
}

/**
 * A time without a date or timezone.
 */
export class PlainTime implements BaseTemporal.PlainTime {
  // Private like the internal slots of Temporal, so the value has no own properties.
  readonly #hour: number;
  readonly #minute: number;
  readonly #second: number;
  readonly #millisecond: number;
  readonly #microsecond: number;
  readonly #nanosecond: number;

  constructor(hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    const fields = readTime(
      { hour, minute, second, millisecond, microsecond, nanosecond },
      { overflow: 'reject' },
    );
    this.#hour = fields.hour;
    this.#minute = fields.minute;
    this.#second = fields.second;
    this.#millisecond = fields.millisecond;
    this.#microsecond = fields.microsecond;
    this.#nanosecond = fields.nanosecond;
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

  static from(item: PlainTimeInput, options?: AssignmentOptions): PlainTime {
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

  with(fields: PlainTimeFields, options?: AssignmentOptions): PlainTime {
    const partial = readWithFields(fields, 'PlainTime.prototype.with()', TIME_FIELDS);
    const next: PlainTimeFields = {};
    for (const key of TIME_FIELDS) {
      next[key] = partial[key] === undefined ? this[key] : partial[key];
    }
    return PlainTime.from(next, options);
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
  get [Symbol.toStringTag](): string {
    return 'Temporal.PlainTime';
  }
}
