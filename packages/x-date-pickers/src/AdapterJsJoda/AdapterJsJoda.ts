/* eslint-disable class-methods-use-this */
import {
  ChronoField,
  ChronoUnit,
  convert,
  DateTimeFormatter,
  DayOfWeek,
  LocalDate,
  LocalDateTime,
  LocalTime,
  Month,
  TemporalAdjusters,
  Year,
  ZonedDateTime,
  ZoneId,
} from '@js-joda/core';
import type { Locale } from '@js-joda/locale_en-us';
import type {
  AdapterFormats,
  AdapterOptions,
  DateBuilderReturnType,
  FieldFormatTokenMap,
  MuiPickersAdapter,
  PickersTimezone,
} from '@mui/x-date-pickers/models';

/**
 * js-joda is unique in having distinct data types for date versus date and
 * time.  Because this is unique to js-joda, MUI doesn't maintain this
 * distinction; it assumes everything is date and time and uses startOfDay to
 * represent a date.  We use this symbol to track startOfDay timestamps that can
 * act as dates.
 */
const startOfDay = Symbol('startOfDay');

declare module '@mui/x-date-pickers/models' {
  export interface PickerValidDateLookup {
    'js-joda': CalendarType;
  }
}
declare module '@js-joda/core' {
  interface Temporal {
    [startOfDay]?: boolean;
  }
}

export type CalendarType = LocalDateTime | LocalDate | ZonedDateTime;

const defaultFormats: AdapterFormats = {
  dayOfMonth: 'd',
  dayOfMonthFull: 'd', // e.g., "9th" - not supported by js-joda
  fullDate: 'MMM d, yyyy',
  fullTime: 'hh:mm a',
  fullTime12h: 'hh:mm a',
  fullTime24h: 'HH:mm',
  hours12h: 'hh',
  hours24h: 'HH',
  meridiem: 'a',
  keyboardDate: 'MM/dd/yyyy',
  keyboardDateTime: 'MM/dd/yyyy hh:mm a',
  keyboardDateTime12h: 'MM/dd/yyyy hh:mm a',
  keyboardDateTime24h: 'MM/dd/yyyy HH:mm',
  minutes: 'mm',
  month: 'MMMM',
  monthShort: 'MMM',
  weekday: 'EEEE',
  weekdayShort: 'EEE',
  normalDate: 'd MMMM',
  normalDateWithWeekday: 'EEE, MMM d',
  seconds: 'ss',
  shortDate: 'MMM d',
  year: 'yyyy',
};

// See https://js-joda.github.io/js-joda/manual/formatting.html
// and https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
const formatTokenMap: FieldFormatTokenMap = {
  // Year
  y: 'year',
  yy: 'year',
  yyyy: 'year',

  // Month
  M: 'month',
  MM: 'month',
  MMM: { sectionType: 'month', contentType: 'letter' },
  MMMM: { sectionType: 'month', contentType: 'letter' },

  // Day of the month
  d: 'day',
  dd: 'day',

  // Day of the week
  u: 'weekDay',
  E: { sectionType: 'weekDay', contentType: 'letter' },
  EEEE: { sectionType: 'weekDay', contentType: 'letter' },

  // Meridiem
  A: 'meridiem',
  a: 'meridiem',

  // Hours
  H: 'hours',
  HH: 'hours',
  h: 'hours',
  hh: 'hours',
  k: 'hours',
  kk: 'hours',

  // Minutes
  m: 'minutes',
  mm: 'minutes',

  // Seconds
  s: 'seconds',
  ss: 'seconds',
};

/**
 * Adds js-joda support to MUI-X:
 *
 * - https://github.com/mui/mui-x/pull/8438
 * - https://github.com/mui/mui-x/issues/6470
 * - https://github.com/mui/mui-x/issues/4703
 * - https://github.com/dmtrKovalenko/date-io/pull/634
 *
 * Based in part on @date-io/js-joda, which is
 *
 * Copyright (c) 2017 Dmitriy Kovalenko
 *
 * and used under the terms of the MIT license.
 */
export class AdapterJsJoda implements MuiPickersAdapter<CalendarType> {
  public isMUIAdapter = true;

  public isTimezoneCompatible = true;

  public lib = 'js-joda';

  public locale: Locale;

  public formats: AdapterFormats;

  public escapedCharacters = { start: '[', end: ']' };

  public formatTokenMap = formatTokenMap;

  constructor({ locale, formats }: AdapterOptions<Locale, never> & { locale: Locale }) {
    if (!locale) {
      // E.g., Locale.ENGLISH from @js-joda/locale_en-us.
      throw new Error('adapterLocale is required for AdapterJsJoda');
    }
    this.locale = locale;
    this.formats = { ...defaultFormats, ...formats };
  }

  private formatter = (formatString: string) => {
    let formatter = DateTimeFormatter.ofPattern(formatString);
    if (this.locale) {
      formatter = formatter.withLocale(this.locale);
    }
    return formatter;
  };

  private zone = (timezone: PickersTimezone): ZoneId =>
    timezone === 'system' || timezone === 'default' ? ZoneId.SYSTEM : ZoneId.of(timezone);

  // Manipulating time on a local date may indicate, e.g., using a DatePicker to
  // change the date portion without affecting the selected time.  On a
  // LocalDate, that's a noop.
  private getTime = (value: CalendarType, field: ChronoField): number => {
    if (value instanceof LocalDate || value[startOfDay]) {
      return -0;
    }
    return value.get(field);
  };

  private setTime = (value: CalendarType, field: ChronoField, amount: number): CalendarType => {
    if (value instanceof LocalDate && Object.is(amount, -0)) {
      // A -0 from getTime indicates a LocalDate or startOfDay.  Let the date
      // remain a date.
      return value;
    }
    if (value instanceof LocalDate) {
      // Coerce to LocalDateTime.
      return LocalDateTime.of(value, LocalTime.of(0, 0, 0).with(field, amount));
    }
    return value instanceof LocalDate ? value : value.with(field, amount);
  };

  public date = <T extends string | null | undefined>(
    value?: T,
    timezone?: PickersTimezone,
  ): DateBuilderReturnType<T, CalendarType> => {
    type R = DateBuilderReturnType<T, CalendarType>;
    if (value === null) {
      return null as R;
    }
    const parsedValue = value ? LocalDateTime.parse(value) : LocalDateTime.now();
    return (
      timezone ? (ZonedDateTime.of(parsedValue, this.zone(timezone)) as CalendarType) : parsedValue
    ) as R;
  };

  // All js-joda objects are valid.  Since it's a Java-inspired API, we'll
  // resort to null for invalid.
  public getInvalidDate = (): CalendarType => null as any;

  public getTimezone = (value: CalendarType | null): string =>
    value instanceof ZonedDateTime ? value.zone().id() : 'system';

  public setTimezone = (value: CalendarType, timezone: PickersTimezone): CalendarType => {
    if (value instanceof LocalDate) {
      return value;
    }
    if (value instanceof LocalDateTime) {
      return ZonedDateTime.of(value, this.zone(timezone));
    }
    return value.withZoneSameInstant(this.zone(timezone));
  };

  public toJsDate = (value: CalendarType): Date => convert(value).toDate();

  public parse = (value: string, format: string): CalendarType | null => {
    try {
      const timeFields = [
        ChronoField.HOUR_OF_DAY,
        ChronoField.MINUTE_OF_HOUR,
        ChronoField.SECOND_OF_MINUTE,
      ];
      const dateFields = [ChronoField.DAY_OF_MONTH, ChronoField.MONTH_OF_YEAR, ChronoField.YEAR];

      const accessor = this.formatter(format).parse(value);
      const timeFieldCount = timeFields.filter((f) => accessor.isSupported(f)).length;
      const dateFieldCount = dateFields.filter((f) => accessor.isSupported(f)).length;
      if (timeFieldCount === timeFields.length && dateFieldCount === dateFields.length) {
        return LocalDateTime.from(accessor);
      }
      if (timeFieldCount === timeFields.length) {
        return LocalDate.from(accessor);
      }

      // For compatibility with other adapters, allow constructing from a
      // partial date/time plus the current timestamp as a reference.  Note that
      // this behavior differs from other adapters - e.g., if you parse a day
      // field:
      //
      // - Day.js and date-fns reset the hour/minute/second to 0 in the local
      //   timezone.
      // - This implementation merges only the day field, leaving
      //   hour/minute/second unchanged.
      let result = timeFieldCount
        ? LocalDateTime.now().with(ChronoField.MILLI_OF_SECOND, 0)
        : LocalDate.now();
      [timeFields, dateFields].forEach((fields) =>
        fields.forEach((field) => {
          if (accessor.isSupported(field)) {
            result = result.with(field, accessor.get(field));
          }
        }),
      );
      return result;
    } catch (ex) {
      return null;
    }
  };

  public getCurrentLocaleCode = (): string => this.locale.toString();

  public is12HourCycleInCurrentLocale = (): boolean => true; // TODO - unimplemented

  public expandFormat = (format: string): string => format;

  public isValid = (value: CalendarType | null): boolean => !!value;

  public format = (value: CalendarType, formatKey: keyof AdapterFormats): string =>
    this.formatByString(value, this.formats[formatKey]);

  public formatByString = (value: CalendarType, formatString: string): string =>
    this.formatter(formatString).format(value);

  public formatNumber = (numberToFormat: string): string => numberToFormat;

  /**
   * MUI-X and clients may not consistently specify timezones.  We don't want to
   * make them accommodate js-joda's stricter behavior here.
   */
  private compareWithCoerce = (
    value: CalendarType,
    comparing: CalendarType,
    op: 'equals' | 'isAfter' | 'isBefore',
  ): boolean => {
    if (value instanceof LocalDateTime && comparing instanceof ZonedDateTime) {
      return value[op](comparing.toLocalDateTime());
    }
    if (
      value instanceof LocalDate &&
      (comparing instanceof ZonedDateTime || comparing instanceof LocalDateTime)
    ) {
      return value[op](LocalDate.from(comparing));
    }
    if (value instanceof ZonedDateTime && comparing instanceof LocalDateTime) {
      return value.toLocalDateTime()[op](comparing);
    }
    if (
      (value instanceof ZonedDateTime || value instanceof LocalDateTime) &&
      comparing instanceof LocalDate
    ) {
      return LocalDate.from(value)[op](comparing);
    }
    return value[op](comparing);
  };

  public isEqual = (value: CalendarType | null, comparing: CalendarType | null): boolean =>
    (value === null && comparing === null) ||
    (!!value && !!comparing && this.compareWithCoerce(value, comparing, 'equals'));

  public isSameYear = (value: CalendarType, comparing: CalendarType): boolean =>
    Year.from(value).equals(Year.from(comparing));

  public isSameMonth = (value: CalendarType, comparing: CalendarType): boolean =>
    Month.from(value).equals(Month.from(comparing));

  public isSameDay = (value: CalendarType, comparing: CalendarType): boolean =>
    LocalDate.from(value).equals(LocalDate.from(comparing));

  public isSameHour = (value: CalendarType, comparing: CalendarType): boolean => {
    if (value instanceof LocalDate && comparing instanceof LocalDate) {
      return true;
    }
    if (value instanceof LocalDate || comparing instanceof LocalDate) {
      return false;
    }
    return this.compareWithCoerce(
      value.truncatedTo(ChronoUnit.MINUTES),
      comparing.truncatedTo(ChronoUnit.MINUTES),
      'equals',
    );
  };

  public isAfter = (value: CalendarType, comparing: CalendarType): boolean =>
    this.compareWithCoerce(value, comparing, 'isAfter');

  public isAfterYear = (value: CalendarType, comparing: CalendarType): boolean =>
    Year.from(value).isAfter(Year.from(comparing));

  public isAfterDay = (value: CalendarType, comparing: CalendarType): boolean =>
    LocalDate.from(value).isAfter(LocalDate.from(comparing));

  public isBefore = (value: CalendarType, comparing: CalendarType): boolean =>
    this.compareWithCoerce(value, comparing, 'isBefore');

  public isBeforeYear = (value: CalendarType, comparing: CalendarType): boolean =>
    Year.from(value).isBefore(Year.from(comparing));

  public isBeforeDay = (value: CalendarType, comparing: CalendarType): boolean =>
    LocalDate.from(value).isBefore(LocalDate.from(comparing));

  public isWithinRange = (value: CalendarType, range: [CalendarType, CalendarType]): boolean =>
    !this.isBefore(value, range[0]) && !this.isAfter(value, range[1]);

  public startOfYear = (value: CalendarType): CalendarType =>
    this.startOfDay(value).with(ChronoField.DAY_OF_YEAR, 1);

  public startOfMonth = (value: CalendarType): CalendarType =>
    this.startOfDay(value.with(ChronoField.DAY_OF_MONTH, 1));

  public startOfDay = (value: CalendarType): CalendarType =>
    value instanceof LocalDate ? value : value.with(ChronoField.NANO_OF_DAY, 0);

  public endOfYear = (value: CalendarType): CalendarType =>
    this.endOfDay(value.with(TemporalAdjusters.lastDayOfYear()));

  public endOfMonth = (value: CalendarType): CalendarType =>
    this.endOfDay(value.with(TemporalAdjusters.lastDayOfMonth()));

  public endOfDay = (value: CalendarType): CalendarType =>
    value instanceof LocalDate ? value : value.with(ChronoField.NANO_OF_DAY, 86_399_999_999_999);

  // js-joda defaults to ISO week fields (ending on Sunday).  We want to instead
  // start on Sunday.
  public startOfWeek = (value: CalendarType): CalendarType =>
    this.startOfDay(value.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)));

  public endOfWeek = (value: CalendarType): CalendarType =>
    this.endOfDay(value.with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).minus(1, ChronoUnit.DAYS));

  public addYears = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.YEARS);

  public addMonths = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.MONTHS);

  public addWeeks = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.WEEKS);

  public addDays = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.DAYS);

  public addHours = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.HOURS);

  public addMinutes = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.MINUTES);

  public addSeconds = (value: CalendarType, amount: number): CalendarType =>
    value.plus(amount, ChronoUnit.SECONDS);

  public getYear = (value: CalendarType): number => value.get(ChronoField.YEAR);

  public getMonth = (value: CalendarType): number => value.get(ChronoField.MONTH_OF_YEAR);

  public getDate = (value: CalendarType): number => value.get(ChronoField.DAY_OF_MONTH);

  public getHours = (value: CalendarType): number => this.getTime(value, ChronoField.HOUR_OF_DAY);

  public getMinutes = (value: CalendarType): number =>
    this.getTime(value, ChronoField.MINUTE_OF_HOUR);

  public getSeconds = (value: CalendarType): number =>
    this.getTime(value, ChronoField.SECOND_OF_MINUTE);

  public getMilliseconds = (value: CalendarType): number =>
    this.getTime(value, ChronoField.MILLI_OF_SECOND);

  public setYear = (value: CalendarType, year: number): CalendarType =>
    value.with(ChronoField.YEAR, year);

  public setMonth = (value: CalendarType, month: number): CalendarType =>
    value.with(ChronoField.MONTH_OF_YEAR, month);

  public setDate = (value: CalendarType, date: number): CalendarType =>
    value.with(ChronoField.DAY_OF_MONTH, date);

  public setHours = (value: CalendarType, hours: number): CalendarType =>
    this.setTime(value, ChronoField.HOUR_OF_DAY, hours);

  public setMinutes = (value: CalendarType, minutes: number): CalendarType =>
    this.setTime(value, ChronoField.MINUTE_OF_HOUR, minutes);

  public setSeconds = (value: CalendarType, seconds: number) =>
    this.setTime(value, ChronoField.SECOND_OF_MINUTE, seconds);

  public setMilliseconds = (value: CalendarType, milliseconds: number) =>
    this.setTime(value, ChronoField.MILLI_OF_SECOND, milliseconds);

  public getDaysInMonth = (value: CalendarType): number =>
    value.range(ChronoField.DAY_OF_MONTH).maximum();

  public getWeekArray = (value: CalendarType): CalendarType[][] => {
    if (!(value instanceof LocalDate)) {
      value = LocalDate.from(value);
    }
    const start = this.startOfWeek(this.startOfMonth(value)) as LocalDate;
    const end = this.endOfWeek(this.endOfMonth(value)) as LocalDate;

    let count = 0;
    let current = start;
    const nestedWeeks: LocalDate[][] = [];

    while (!current.isAfter(end)) {
      const weekNumber = Math.floor(count / 7);
      nestedWeeks[weekNumber] ||= [];
      nestedWeeks[weekNumber].push(current);
      current = current.plusDays(1);
      count += 1;
    }
    return nestedWeeks;
  };

  // js-joda defaults to ISO week fields (ending on Sunday).  We want to instead
  // start on Sunday, without incurring a dependency on js-joda's
  // locale-specific WeekFields.SUNDAY_START.
  public getWeekNumber = (value: CalendarType): number => {
    const alignedWeekNumber = value.get(ChronoField.ALIGNED_WEEK_OF_YEAR);
    const dayOfWeek = this.getDayOfWeek(value);
    const firstDayOfWeekOfYear = this.getDayOfWeek(value.with(ChronoField.DAY_OF_YEAR, 1));
    return dayOfWeek < firstDayOfWeekOfYear ? alignedWeekNumber + 1 : alignedWeekNumber;
  };

  public getDayOfWeek = (value: CalendarType): number =>
    (value.get(ChronoField.DAY_OF_WEEK) % 7) + 1;

  public getYearRange = (range: [CalendarType, CalendarType]): CalendarType[] => {
    const years: LocalDate[] = [];
    let startYear = Year.from(range[0]);
    const endYear = Year.from(range[1]);
    while (!startYear.isAfter(endYear)) {
      years.push(startYear.atDay(1));
      startYear = startYear.plusYears(1);
    }
    return years;
  };
}
