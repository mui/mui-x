export const MS_PER_DAY = 86_400_000;

/**
 * `HH:mm`, `HH:mm:ss` or `HH:mm:ss` with up to nine fractional digits.
 */
export const ISO_TIME_REGEXP = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?$/;

const DAYS_PER_400_YEARS = 146_097;
// Day numbers count from 1970-01-01, the arithmetic below from 0000-03-01.
const DAYS_FROM_0000_03_01_TO_1970_01_01 = 719_468;

/**
 * The number of days from 1970-01-01 to a day of the proleptic Gregorian calendar.
 * `month` goes from 1 to 12 and `day` must exist in the month.
 */
export function toDayNumber(year: number, month: number, day: number): number {
  // Years start on March 1st, so the leap day is the last day of its year.
  const marchYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(marchYear / 400);
  const yearOfEra = marchYear - era * 400;
  const dayOfYear = Math.floor((153 * ((month + 9) % 12) + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * DAYS_PER_400_YEARS + dayOfEra - DAYS_FROM_0000_03_01_TO_1970_01_01;
}

/**
 * Converts a day number to date parts. Months are numbered from 1 to 12.
 */
export function fromDayNumber(dayNumber: number): { year: number; month: number; day: number } {
  const daysFromEpoch = dayNumber + DAYS_FROM_0000_03_01_TO_1970_01_01;
  const era = Math.floor(daysFromEpoch / DAYS_PER_400_YEARS);
  const dayOfEra = daysFromEpoch - era * DAYS_PER_400_YEARS;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36_524) -
      Math.floor(dayOfEra / 146_096)) /
      365,
  );
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthFromMarch = Math.floor((5 * dayOfYear + 2) / 153);
  const month = monthFromMarch < 10 ? monthFromMarch + 3 : monthFromMarch - 9;
  return {
    year: yearOfEra + era * 400 + (month <= 2 ? 1 : 0),
    month,
    day: dayOfYear - Math.floor((153 * monthFromMarch + 2) / 5) + 1,
  };
}

/**
 * The supported range of day numbers, covering years 0 to 9999.
 */
export const FIRST_SUPPORTED_DAY = /* @__PURE__ */ toDayNumber(0, 1, 1);
export const LAST_SUPPORTED_DAY = /* @__PURE__ */ toDayNumber(9999, 12, 31);

/**
 * The ISO day of the week of a day number, from 1 (Monday) to 7 (Sunday).
 */
export function getIsoDayOfWeek(dayNumber: number): number {
  // 1970-01-01 is a Thursday.
  return ((((dayNumber + 3) % 7) + 7) % 7) + 1;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

export function isValidIsoDate(year: number, month: number, day: number): boolean {
  return (
    year >= 0 &&
    year <= 9999 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= getDaysInMonth(year, month)
  );
}

/**
 * Formats a date as `YYYY-MM-DD`, using a signed six-digit year outside years 0 to 9999.
 */
export function formatIsoDate(year: number, month: number, day: number) {
  let yearString: string;
  if (year < 0 || year > 9999) {
    yearString = `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`;
  } else {
    yearString = year < 1000 ? String(year).padStart(4, '0') : String(year);
  }
  return `${yearString}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

export interface IsoTimeFields {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  microsecond: number;
  nanosecond: number;
}

export const TIME_FIELD_MAXIMUMS: Readonly<IsoTimeFields> = {
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999,
  microsecond: 999,
  nanosecond: 999,
};

export const TIME_FIELDS = [
  'hour',
  'minute',
  'second',
  'millisecond',
  'microsecond',
  'nanosecond',
] as const;

export function isValidIsoTime(time: IsoTimeFields): boolean {
  return TIME_FIELDS.every(
    (field) => time[field] >= 0 && time[field] <= TIME_FIELD_MAXIMUMS[field],
  );
}

/**
 * Nanoseconds since midnight, always a safe integer.
 */
export function getTimeNumber(time: IsoTimeFields): number {
  return (
    ((time.hour * 60 + time.minute) * 60 + time.second) * 1e9 +
    time.millisecond * 1e6 +
    time.microsecond * 1e3 +
    time.nanosecond
  );
}

export function formatIsoTime(time: IsoTimeFields): string {
  const fraction =
    `${String(time.millisecond).padStart(3, '0')}${String(time.microsecond).padStart(3, '0')}${String(time.nanosecond).padStart(3, '0')}`.replace(
      /0+$/,
      '',
    );
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Truncates a finite number to an integer, following Temporal.
 */
export function toInteger(value: unknown, field: string): number {
  // Unlike `Number()`, `+` throws on a BigInt, like Temporal.
  const number = +(value as number);
  if (!Number.isFinite(number)) {
    throw new Error(
      `Base UI Plus: A temporal value received ${String(value)} as the ${field}, which isn't a finite number. ` +
        'A temporal value cannot represent a non-finite field. ' +
        'Pass finite numbers for its date and time fields.',
    );
  }
  // `+ 0` turns -0 into 0, as `-0.5` truncates to the year 0.
  return Math.trunc(number) + 0;
}

/**
 * Reads the `overflow` option of `apiName`, such as `'PlainDate.from()'`.
 */
export function readOverflow(
  options: { overflow?: 'constrain' | 'reject' | undefined } | undefined,
  apiName: string,
): 'constrain' | 'reject' {
  if (options === undefined) {
    return 'constrain';
  }
  if (typeof options !== 'object' || options === null) {
    throw new TypeError(
      `Base UI Plus: The options of \`BaseTemporal.${apiName}\` are ${String(options)}, which isn't an object. ` +
        "The method can't read the `overflow` option from them. " +
        "Pass an object such as `{ overflow: 'reject' }`, or no options.",
    );
  }
  const overflow = options.overflow ?? 'constrain';
  if (overflow !== 'constrain' && overflow !== 'reject') {
    throw new Error(
      `Base UI Plus: The \`overflow\` option of \`BaseTemporal.${apiName}\` is ${String(overflow)}, which isn't supported. ` +
        "The method can't tell whether to adjust or reject a field above its range. " +
        "Pass `'constrain'` or `'reject'`.",
    );
  }
  return overflow;
}

export function compareOrder(a: number | bigint, b: number | bigint): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

export function throwOnPrimitiveConversion(name: string): never {
  throw new TypeError(
    `Base UI Plus: A \`${name}\` was converted to a primitive value, for example by \`<\`, \`>\` or \`+\`. ` +
      "Comparing or adding temporal values this way gives meaningless results, so it isn't allowed. " +
      'Use the static `compare()` method or `equals()` to compare them, and `toString()` to get them as a string.',
  );
}
