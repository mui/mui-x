import type {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
  PickersTimezone,
} from '../models';

const formatTokenMap: FieldFormatTokenMap = {
  // Year
  yy: 'year',
  yyyy: { sectionType: 'year', contentType: 'digit', maxLength: 4 },

  // Month
  M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
  dd: 'day',

  // Day of the week
  EE: { sectionType: 'weekDay', contentType: 'letter' },
  EEE: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  a: 'meridiem',

  // Hours
  H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  HH: 'hours',
  h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
  hh: 'hours',

  // Minutes
  m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
  mm: 'minutes',

  // Seconds
  s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
  ss: 'seconds',
};

const defaultFormats: AdapterFormats = {
  year: 'yyyy',
  month: 'MMMM',
  monthShort: 'MMM',
  dayOfMonth: 'd',
  dayOfMonthFull: 'd',
  weekday: 'EEEE',
  weekdayShort: 'EE',
  hours24h: 'HH',
  hours12h: 'hh',
  meridiem: 'a',
  minutes: 'mm',
  seconds: 'ss',

  fullDate: 'MMM d, yyyy',
  keyboardDate: 'MM/dd/yyyy',
  shortDate: 'MMM d',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',

  fullTime12h: 'hh:mm a',
  fullTime24h: 'HH:mm',

  keyboardDateTime12h: 'MM/dd/yyyy hh:mm a',
  keyboardDateTime24h: 'MM/dd/yyyy HH:mm',
};

/**
 * The value handled by the Temporal adapter.
 * Wraps a `Temporal.ZonedDateTime` and keeps track of the logical timezone requested by the user
 * (`system`, `UTC`, or a named IANA zone) since `Temporal` cannot represent the difference between
 * `system` and a named zone that happens to resolve to the same offset.
 */
export class AdapterTemporalDate {
  /**
   * The underlying `Temporal.ZonedDateTime`, or `null` when the date is invalid.
   */
  public readonly value: Temporal.ZonedDateTime | null;

  /**
   * The logical timezone: `system`, `UTC`, or a named IANA zone.
   */
  public readonly timezone: PickersTimezone;

  constructor(value: Temporal.ZonedDateTime | null, timezone: PickersTimezone) {
    this.value = value;
    this.timezone = timezone;
  }

  get isValid(): boolean {
    return this.value !== null;
  }

  toJSDate(): Date {
    return this.value === null ? new Date(NaN) : new Date(this.value.epochMilliseconds);
  }

  valueOf(): number {
    return this.value === null ? NaN : this.value.epochMilliseconds;
  }

  toString(): string {
    return this.value === null ? 'Invalid Date' : this.value.toString();
  }
}

declare module '@mui/x-date-pickers/models' {
  interface PickerValidDateLookup {
    temporal: AdapterTemporalDate;
  }
}

/**
 * The timezone used when the `default` timezone is requested and no explicit default has been set.
 * `Temporal` has no global default timezone, so the adapter provides its own.
 */
let defaultTimezone: PickersTimezone = 'system';

/**
 * Set the timezone used by the Temporal adapter when the `default` timezone is requested.
 * `Temporal` does not expose a global default timezone (unlike `luxon`, `moment` or `dayjs`),
 * so this function is the way to configure it.
 * @param {PickersTimezone | undefined} timezone The timezone to use as default, or `undefined` to reset to `system`.
 */
export function setDefaultTimezone(timezone?: PickersTimezone) {
  defaultTimezone = timezone ?? 'system';
}

function pad(value: number, length: number): string {
  return String(Math.abs(value)).padStart(length, '0');
}

function to12Hours(hour: number): number {
  const value = hour % 12;
  return value === 0 ? 12 : value;
}

// Matches escaped sections (wrapped in single quotes) and the supported tokens, longest first.
const FORMAT_TOKEN_REGEXP =
  /'[^']*'|MMMM|MMM|MM|M|EEEE|EEE|EE|yyyy|yy|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a/g;

// Token descriptors for `parse`: [token, capture group, field].
const PARSE_TOKENS: [string, string, string][] = [
  ['yyyy', '(\\d{4})', 'year'],
  ['yy', '(\\d{2})', 'year2'],
  ['MM', '(\\d{2})', 'month'],
  ['M', '(\\d{1,2})', 'month'],
  ['dd', '(\\d{2})', 'day'],
  ['d', '(\\d{1,2})', 'day'],
  ['HH', '(\\d{2})', 'hour'],
  ['H', '(\\d{1,2})', 'hour'],
  ['hh', '(\\d{2})', 'hour12'],
  ['h', '(\\d{1,2})', 'hour12'],
  ['mm', '(\\d{2})', 'minute'],
  ['m', '(\\d{1,2})', 'minute'],
  ['ss', '(\\d{2})', 'second'],
  ['s', '(\\d{1,2})', 'second'],
  ['SSS', '(\\d{3})', 'millisecond'],
  ['a', '(AM|PM|am|pm)', 'meridiem'],
];

export class AdapterTemporal implements MuiPickersAdapter<string> {
  public isMUIAdapter = true;

  public isTimezoneCompatible = true;

  public lib = 'temporal';

  public locale: string;

  public formats: AdapterFormats;

  public escapedCharacters = { start: "'", end: "'" };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats }: AdapterOptions<string, never> = {}) {
    if (typeof Temporal === 'undefined') {
      throw new Error(
        `MUI X Date Pickers: The \`Temporal\` API is not available in this environment.
The \`AdapterTemporal\` adapter relies on the global \`Temporal\` object, which your runtime does not provide natively.
Load a Temporal polyfill (for example \`import 'temporal-polyfill/global'\`) before creating the adapter.
See https://mui.com/x/react-date-pickers/date-localization/ for more details.`,
      );
    }

    this.locale = locale || 'en-US';
    this.formats = { ...defaultFormats, ...formats };
  }

  private getSystemTimezone = (): string => {
    return Temporal.Now.timeZoneId();
  };

  /**
   * Resolve a `PickersTimezone` into the concrete IANA zone to use with `Temporal`, and the logical
   * timezone to remember on the value.
   */
  private resolveTimezone = (
    timezone: PickersTimezone,
  ): { zone: string; logical: PickersTimezone } => {
    if (timezone === 'default') {
      if (defaultTimezone === 'system') {
        return { zone: this.getSystemTimezone(), logical: 'system' };
      }
      return this.resolveTimezone(defaultTimezone);
    }
    if (timezone === 'system') {
      return { zone: this.getSystemTimezone(), logical: 'system' };
    }
    return { zone: timezone, logical: timezone };
  };

  private createDate = (
    zonedDateTime: Temporal.ZonedDateTime | null,
    timezone: PickersTimezone,
  ): AdapterTemporalDate => {
    return new AdapterTemporalDate(zonedDateTime, timezone);
  };

  /**
   * Build a new value from an operation on an existing value, keeping its logical timezone.
   */
  private withValue = (
    source: AdapterTemporalDate,
    zonedDateTime: Temporal.ZonedDateTime,
  ): AdapterTemporalDate => {
    return new AdapterTemporalDate(zonedDateTime, source.timezone);
  };

  private intlFormat = (
    value: AdapterTemporalDate,
    options: Intl.DateTimeFormatOptions,
  ): string => {
    const zdt = value.value!;
    return new Intl.DateTimeFormat(this.locale, {
      timeZone: zdt.timeZoneId,
      ...options,
    }).format(new Date(zdt.epochMilliseconds));
  };

  private getMeridiemString = (value: AdapterTemporalDate): string => {
    const zdt = value.value!;
    const parts = new Intl.DateTimeFormat(this.locale, {
      timeZone: zdt.timeZoneId,
      hour: 'numeric',
      hour12: true,
    }).formatToParts(new Date(zdt.epochMilliseconds));
    const dayPeriod = parts.find((part) => part.type === 'dayPeriod');
    if (dayPeriod) {
      return dayPeriod.value;
    }
    /* v8 ignore next */
    return zdt.hour < 12 ? 'AM' : 'PM';
  };

  private getFirstDayOfWeek = (): number => {
    const locale = new Intl.Locale(this.locale);
    // `getWeekInfo` is the standard method, `weekInfo` a non-standard fallback used by some engines.
    const weekInfo =
      // @ts-ignore `getWeekInfo` is not yet in the TS lib.
      typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : (locale as any).weekInfo;
    // `firstDay` uses 1 (Monday) to 7 (Sunday), the same convention as `Temporal`'s `dayOfWeek`.
    return weekInfo?.firstDay ?? 7;
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone: PickersTimezone = 'default',
  ): DateBuilderReturnType<T> => {
    type R = DateBuilderReturnType<T>;
    if (value === null) {
      return null as unknown as R;
    }

    const { zone, logical } = this.resolveTimezone(timezone);

    if (typeof value === 'undefined') {
      return this.createDate(Temporal.Now.zonedDateTimeISO(zone), logical) as unknown as R;
    }

    try {
      // A string with an offset or a `Z` suffix represents an exact instant.
      const instant = Temporal.Instant.from(value);
      return this.createDate(instant.toZonedDateTimeISO(zone), logical) as unknown as R;
    } catch (error) {
      // Otherwise, interpret the string as a wall-clock time in the target timezone.
      try {
        const plainDateTime = Temporal.PlainDateTime.from(value);
        return this.createDate(plainDateTime.toZonedDateTime(zone), logical) as unknown as R;
      } catch (innerError) {
        return this.createDate(null, logical) as unknown as R;
      }
    }
  };

  public getInvalidDate = () => this.createDate(null, 'system');

  public getTimezone = (value: AdapterTemporalDate): string => {
    return value.timezone;
  };

  public setTimezone = (value: AdapterTemporalDate, timezone: PickersTimezone) => {
    if (value.value === null) {
      return this.createDate(null, timezone);
    }
    const { zone, logical } = this.resolveTimezone(timezone);
    return this.createDate(value.value.withTimeZone(zone), logical);
  };

  public toJsDate = (value: AdapterTemporalDate) => {
    return value.toJSDate();
  };

  public parse = (value: string, format: string): AdapterTemporalDate | null => {
    if (value === '') {
      return null;
    }

    const { zone, logical } = this.resolveTimezone('default');
    const fields: string[] = [];
    let regexString = '^';

    let index = 0;
    while (index < format.length) {
      const remaining = format.slice(index);
      const token = PARSE_TOKENS.find((candidate) => remaining.startsWith(candidate[0]));

      if (token) {
        regexString += token[1];
        fields.push(token[2]);
        index += token[0].length;
      } else {
        regexString += format[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        index += 1;
      }
    }
    regexString += '$';

    const match = value.match(new RegExp(regexString));
    if (!match) {
      return this.createDate(null, logical);
    }

    const parsed: Record<string, number | string> = {};
    fields.forEach((field, fieldIndex) => {
      parsed[field] = match[fieldIndex + 1];
    });

    let hour = parsed.hour !== undefined ? Number(parsed.hour) : 0;
    if (parsed.hour12 !== undefined) {
      const base = Number(parsed.hour12) % 12;
      const isPM = typeof parsed.meridiem === 'string' && parsed.meridiem.toUpperCase() === 'PM';
      hour = base + (isPM ? 12 : 0);
    }

    try {
      const plainDateTime = Temporal.PlainDateTime.from(
        {
          year: parsed.year !== undefined ? Number(parsed.year) : 1970,
          month: parsed.month !== undefined ? Number(parsed.month) : 1,
          day: parsed.day !== undefined ? Number(parsed.day) : 1,
          hour,
          minute: parsed.minute !== undefined ? Number(parsed.minute) : 0,
          second: parsed.second !== undefined ? Number(parsed.second) : 0,
          millisecond: parsed.millisecond !== undefined ? Number(parsed.millisecond) : 0,
        },
        { overflow: 'reject' },
      );
      return this.createDate(plainDateTime.toZonedDateTime(zone), logical);
    } catch (error) {
      return this.createDate(null, logical);
    }
  };

  public getCurrentLocaleCode = () => {
    return this.locale;
  };

  public is12HourCycleInCurrentLocale = () => {
    return Boolean(
      new Intl.DateTimeFormat(this.locale, { hour: 'numeric' }).resolvedOptions().hour12,
    );
  };

  public expandFormat = (format: string) => {
    // The adapter only uses concrete tokens, so there is nothing to expand.
    return format;
  };

  public isValid = (value: AdapterTemporalDate | null): value is AdapterTemporalDate => {
    return value != null && value.isValid;
  };

  public format = (value: AdapterTemporalDate, formatKey: keyof AdapterFormats) => {
    return this.formatByString(value, this.formats[formatKey]);
  };

  public formatByString = (value: AdapterTemporalDate, format: string) => {
    const zdt = value.value!;
    return format.replace(FORMAT_TOKEN_REGEXP, (token) => {
      if (token[0] === "'") {
        return token.slice(1, -1);
      }
      switch (token) {
        case 'yyyy':
          return pad(zdt.year, 4);
        case 'yy':
          return pad(zdt.year % 100, 2);
        case 'MMMM':
          return this.intlFormat(value, { month: 'long' });
        case 'MMM':
          return this.intlFormat(value, { month: 'short' });
        case 'MM':
          return pad(zdt.month, 2);
        case 'M':
          return String(zdt.month);
        case 'dd':
          return pad(zdt.day, 2);
        case 'd':
          return String(zdt.day);
        case 'EEEE':
          return this.intlFormat(value, { weekday: 'long' });
        case 'EEE':
          return this.intlFormat(value, { weekday: 'short' });
        case 'EE':
          return this.intlFormat(value, { weekday: 'short' }).slice(0, 2);
        case 'HH':
          return pad(zdt.hour, 2);
        case 'H':
          return String(zdt.hour);
        case 'hh':
          return pad(to12Hours(zdt.hour), 2);
        case 'h':
          return String(to12Hours(zdt.hour));
        case 'mm':
          return pad(zdt.minute, 2);
        case 'm':
          return String(zdt.minute);
        case 'ss':
          return pad(zdt.second, 2);
        case 's':
          return String(zdt.second);
        case 'SSS':
          return pad(zdt.millisecond, 3);
        case 'a':
          return this.getMeridiemString(value);
        /* v8 ignore next 2 */
        default:
          return token;
      }
    });
  };

  public formatNumber = (numberToFormat: string) => {
    return numberToFormat;
  };

  public isEqual = (value: AdapterTemporalDate | null, comparing: AdapterTemporalDate | null) => {
    if (value === null && comparing === null) {
      return true;
    }
    if (value === null || comparing === null) {
      return false;
    }
    if (value.value === null || comparing.value === null) {
      return value.value === comparing.value;
    }
    return value.value.epochNanoseconds === comparing.value.epochNanoseconds;
  };

  /**
   * Represent `comparing` in the timezone of `value` so that field comparisons are done in the same zone.
   */
  private toValueTimezone = (
    value: AdapterTemporalDate,
    comparing: AdapterTemporalDate,
  ): Temporal.ZonedDateTime => {
    return comparing.value!.withTimeZone(value.value!.timeZoneId);
  };

  public isSameYear = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return value.value!.year === this.toValueTimezone(value, comparing).year;
  };

  public isSameMonth = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    const other = this.toValueTimezone(value, comparing);
    return value.value!.year === other.year && value.value!.month === other.month;
  };

  public isSameDay = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return Temporal.PlainDate.compare(value.value!.toPlainDate(), this.toValueTimezone(value, comparing).toPlainDate()) === 0;
  };

  public isSameHour = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    const other = this.toValueTimezone(value, comparing);
    return (
      Temporal.PlainDate.compare(value.value!.toPlainDate(), other.toPlainDate()) === 0 &&
      value.value!.hour === other.hour
    );
  };

  public isAfter = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return value.value!.epochNanoseconds > comparing.value!.epochNanoseconds;
  };

  public isAfterYear = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return value.value!.year > this.toValueTimezone(value, comparing).year;
  };

  public isAfterDay = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return (
      Temporal.PlainDate.compare(
        value.value!.toPlainDate(),
        this.toValueTimezone(value, comparing).toPlainDate(),
      ) > 0
    );
  };

  public isBefore = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return value.value!.epochNanoseconds < comparing.value!.epochNanoseconds;
  };

  public isBeforeYear = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return value.value!.year < this.toValueTimezone(value, comparing).year;
  };

  public isBeforeDay = (value: AdapterTemporalDate, comparing: AdapterTemporalDate) => {
    return (
      Temporal.PlainDate.compare(
        value.value!.toPlainDate(),
        this.toValueTimezone(value, comparing).toPlainDate(),
      ) < 0
    );
  };

  public isWithinRange = (
    value: AdapterTemporalDate,
    [start, end]: [AdapterTemporalDate, AdapterTemporalDate],
  ) => {
    const epoch = value.value!.epochNanoseconds;
    return epoch >= start.value!.epochNanoseconds && epoch <= end.value!.epochNanoseconds;
  };

  public startOfYear = (value: AdapterTemporalDate) => {
    return this.withValue(value, value.value!.with({ month: 1, day: 1 }).startOfDay());
  };

  public startOfMonth = (value: AdapterTemporalDate) => {
    return this.withValue(value, value.value!.with({ day: 1 }).startOfDay());
  };

  public startOfWeek = (value: AdapterTemporalDate) => {
    const firstDay = this.getFirstDayOfWeek();
    const delta = (value.value!.dayOfWeek - firstDay + 7) % 7;
    return this.withValue(value, value.value!.subtract({ days: delta }).startOfDay());
  };

  public startOfDay = (value: AdapterTemporalDate) => {
    return this.withValue(value, value.value!.startOfDay());
  };

  public endOfYear = (value: AdapterTemporalDate) => {
    return this.endOfDay(this.withValue(value, value.value!.with({ month: 12, day: 31 })));
  };

  public endOfMonth = (value: AdapterTemporalDate) => {
    const lastDay = value.value!.daysInMonth;
    return this.endOfDay(this.withValue(value, value.value!.with({ day: lastDay })));
  };

  public endOfWeek = (value: AdapterTemporalDate) => {
    const start = this.startOfWeek(value);
    return this.endOfDay(this.withValue(value, start.value!.add({ days: 6 })));
  };

  public endOfDay = (value: AdapterTemporalDate) => {
    return this.withValue(
      value,
      value.value!.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
      }),
    );
  };

  public addYears = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ years: amount }));
  };

  public addMonths = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ months: amount }));
  };

  public addWeeks = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ weeks: amount }));
  };

  public addDays = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ days: amount }));
  };

  public addHours = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ hours: amount }));
  };

  public addMinutes = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ minutes: amount }));
  };

  public addSeconds = (value: AdapterTemporalDate, amount: number) => {
    return this.withValue(value, value.value!.add({ seconds: amount }));
  };

  public getYear = (value: AdapterTemporalDate) => {
    return value.value!.year;
  };

  public getMonth = (value: AdapterTemporalDate) => {
    return value.value!.month - 1;
  };

  public getDate = (value: AdapterTemporalDate) => {
    return value.value!.day;
  };

  public getHours = (value: AdapterTemporalDate) => {
    return value.value!.hour;
  };

  public getMinutes = (value: AdapterTemporalDate) => {
    return value.value!.minute;
  };

  public getSeconds = (value: AdapterTemporalDate) => {
    return value.value!.second;
  };

  public getMilliseconds = (value: AdapterTemporalDate) => {
    return value.value!.millisecond;
  };

  public setYear = (value: AdapterTemporalDate, year: number) => {
    return this.withValue(value, value.value!.with({ year }));
  };

  public setMonth = (value: AdapterTemporalDate, month: number) => {
    return this.withValue(value, value.value!.with({ month: month + 1 }));
  };

  public setDate = (value: AdapterTemporalDate, date: number) => {
    return this.withValue(value, value.value!.with({ day: date }));
  };

  public setHours = (value: AdapterTemporalDate, hours: number) => {
    return this.withValue(value, value.value!.with({ hour: hours }));
  };

  public setMinutes = (value: AdapterTemporalDate, minutes: number) => {
    return this.withValue(value, value.value!.with({ minute: minutes }));
  };

  public setSeconds = (value: AdapterTemporalDate, seconds: number) => {
    return this.withValue(value, value.value!.with({ second: seconds }));
  };

  public setMilliseconds = (value: AdapterTemporalDate, milliseconds: number) => {
    return this.withValue(value, value.value!.with({ millisecond: milliseconds }));
  };

  public getDaysInMonth = (value: AdapterTemporalDate) => {
    return value.value!.daysInMonth;
  };

  public getWeekArray = (value: AdapterTemporalDate) => {
    const start = this.startOfWeek(this.startOfMonth(value)).value!;
    const end = this.endOfWeek(this.endOfMonth(value)).value!;

    const weeks: AdapterTemporalDate[][] = [];
    let current = start;
    let week: AdapterTemporalDate[] = [];

    while (Temporal.ZonedDateTime.compare(current, end) <= 0) {
      week.push(this.withValue(value, current));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current = current.add({ days: 1 }).startOfDay();
    }

    return weeks;
  };

  public getWeekNumber = (value: AdapterTemporalDate) => {
    const date = value.value!.toPlainDate();
    // ISO 8601 week number: the week is the one containing its Thursday.
    const thursday = date.add({ days: 4 - date.dayOfWeek });
    return Math.ceil(thursday.dayOfYear / 7);
  };

  public getDayOfWeek = (value: AdapterTemporalDate) => {
    const firstDay = this.getFirstDayOfWeek();
    return ((value.value!.dayOfWeek - firstDay + 7) % 7) + 1;
  };

  public getYearRange = ([start, end]: [AdapterTemporalDate, AdapterTemporalDate]) => {
    const endDate = this.endOfYear(end);
    const years: AdapterTemporalDate[] = [];

    let current = this.startOfYear(start);
    while (this.isBefore(current, endDate)) {
      years.push(current);
      current = this.addYears(current, 1);
    }

    return years;
  };
}
