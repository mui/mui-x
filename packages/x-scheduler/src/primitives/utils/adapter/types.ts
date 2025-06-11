import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models';

type FieldSectionType =
  | 'year'
  | 'month'
  | 'day'
  | 'weekDay'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'meridiem'
  | 'empty';

type FieldSectionContentType = 'digit' | 'digit-with-letter' | 'letter';

export type SchedulerTimezone = 'default' | 'system' | 'UTC' | string;

export interface AdapterFormats {
  // Token formats
  /**
   * The 4-digit year.
   * @example "2019"
   */
  year: string;
  /**
   * The full month name.
   * @example "January"
   */
  month: string;
  /**
   * The abbreviated month name.
   * @example "Jan"
   */
  monthShort: string;
  /**
   * The day of the month.
   * @example "1"
   */
  dayOfMonth: string;
  /**
   * The day of the month with letters.
   * @example "2nd"
   */
  dayOfMonthFull: string;
  /**
   * The name of the day of the week.
   * @example "Wednesday"
   */
  weekday: string;
  /**
   * The abbreviated name of the day of the week.
   * @example "Wed"
   * */
  weekdayShort: string;
  /**
   * The hours, 24-hour clock.
   * @example "23"
   */
  hours24h: string;
  /**
   * The hours, 12-hour clock.
   * @example "11"
   */
  hours12h: string;
  /**
   * The meridiem.
   * @example "AM"
   */
  meridiem: string;
  /**
   * The minutes.
   * @example "44"
   */
  minutes: string;
  /**
   * The seconds.
   * @example "00"
   */
  seconds: string;

  // Date formats
  /** The localized full date.
   * Used for the aria-label of the opening button of the `DatePicker`.
   * @example "Jan 1, 2019"
   */
  fullDate: string;
  /**
   * A keyboard input friendly date format.
   * Used in the date fields.
   * @example "02/13/2020"
   */
  keyboardDate: string;
  /**
   * The abbreviated month name and the day of the month.
   * Used in the `DateTimePicker` and `DateRangePicker` toolbars.
   * @example "Jan 1"
   */
  shortDate: string;
  /**
   * The month name and the day of the month.
   * Used in the `DatePicker` toolbar for non-english locales.
   * @example "1 January"
   */
  normalDate: string;
  /**
   * The month name, the day of the week and the day of the month.
   * Used in the `DatePicker` toolbar for english locales.
   * @example "Sun, Jan 1"
   */
  normalDateWithWeekday: string;

  // Time formats
  /**
   * The hours with the meridiem and minutes.
   * @example "11:44 PM"
   */
  fullTime12h: string;
  /**
   * The hours without the meridiem and minutes.
   * @example "23:44"
   */
  fullTime24h: string;

  // Date & Time formats
  /**
   * A keyboard input friendly time format for 12-hour clock.
   * Used in the date-time fields.
   * @example "02/13/2020 11:44 PM"
   */
  keyboardDateTime12h: string;
  /**
   * A keyboard input friendly time format for 24-hour clock.
   * Used in the date-time fields.
   * @example "02/13/2020 23:44"
   */
  keyboardDateTime24h: string;
}

export type FieldFormatTokenMap = {
  [formatToken: string]:
    | FieldSectionType
    | {
        sectionType: FieldSectionType;
        contentType: FieldSectionContentType;
        maxLength?: number;
      };
};

// https://www.zhenghao.io/posts/ts-never#how-to-check-for-never
type PropertyIfNotNever<PName extends string, PType> = [PType] extends [never]
  ? {}
  : { [P in PName]?: PType };

export type AdapterOptions<TLocale, TInstance> = {
  formats?: Partial<AdapterFormats>;
  locale?: TLocale;
} & PropertyIfNotNever<'instance', TInstance>;

export type DateBuilderReturnType<T extends string | null | undefined> = [T] extends [null]
  ? null
  : SchedulerValidDate;

export interface Adapter<TLocale = any> {
  /**
   * A boolean confirming that the adapter used is an MUI adapter.
   */
  isMUIAdapter: boolean;
  isTimezoneCompatible: boolean;
  formats: AdapterFormats;
  locale?: TLocale;
  /**
   * Name of the library that is used right now
   */
  lib: string;
  /**
   * The characters used to escape a string inside a format.
   */
  escapedCharacters: { start: string; end: string };
  /**
   * A map containing all the format that the field components can understand.
   */
  formatTokenMap: FieldFormatTokenMap;
  /**
   * Create a date in the date library format.
   * If no `value` parameter is provided, creates a date with the current timestamp.
   * If a `value` parameter is provided, pass it to the date library to try to parse it.
   * @param {string | null | undefined} value The optional value to parse.
   * @param {SchedulerTimezone} timezone The timezone of the date. Default: "default"
   * @returns {SchedulerValidDate | null} The parsed date.
   */
  date<T extends string | null | undefined>(
    value?: T,
    timezone?: SchedulerTimezone,
  ): DateBuilderReturnType<T>;
  /**
   * Creates an invalid date in the date library format.
   * @deprecated This method will be removed in the next major release (v9.0.0).
   * @returns {SchedulerValidDate} The invalid date.
   */
  getInvalidDate(): SchedulerValidDate;
  /**
   * Extracts the timezone from a date.
   * @param {SchedulerValidDate | null} value The date from which we want to get the timezone.
   * @returns {SchedulerValidDate} The timezone of the date.
   */
  getTimezone(value: SchedulerValidDate | null): SchedulerTimezone;
  /**
   * Convert a date to another timezone.
   * @param {SchedulerValidDate} value The date to convert.
   * @param {SchedulerTimezone} timezone The timezone to convert the date to.
   * @returns {SchedulerValidDate} The converted date.
   */
  setTimezone(value: SchedulerValidDate, timezone: SchedulerTimezone): SchedulerValidDate;
  /**
   * Convert a date in the library format into a JavaScript `Date` object.
   * @param {SchedulerValidDate} value The value to convert.
   * @returns {SchedulerValidDate} the JavaScript date.
   */
  toJsDate(value: SchedulerValidDate): Date;
  /**
   * Parse a string date in a specific format.
   * @param {string} value The string date to parse.
   * @param {string} format The format in which the string date is.
   * @returns {SchedulerValidDate | null} The parsed date.
   */
  parse(value: string, format: string): SchedulerValidDate | null;
  /**
   * Get the code of the locale currently used by the adapter.
   * @returns {string} The code of the locale.
   */
  getCurrentLocaleCode(): string;
  /**
   * Check if the current locale is using 12 hours cycle (i.e: time with meridiem).
   * @returns {boolean} `true` if the current locale is using 12 hours cycle.
   */
  is12HourCycleInCurrentLocale(): boolean;
  /**
   * Create a format with no meta-token (for example: `LLL` or `PP`).
   * @param {string} format The format to expand.
   * @returns {string} The expanded format.
   */
  expandFormat(format: string): string;
  /**
   * Check if the date is valid.
   * @param {SchedulerValidDate | null} value The value to test.
   * @returns {boolean} `true` if the value is a valid date according to the date library.
   */
  isValid(value: SchedulerValidDate | null): value is SchedulerValidDate;
  /**
   * Format a date using an adapter format string (see the `AdapterFormats` interface)
   * @param {SchedulerValidDate} value The date to format.
   * @param {keyof AdapterFormats} formatKey The formatKey to use.
   * @returns {string} The stringify date.
   */
  format(value: SchedulerValidDate, formatKey: keyof AdapterFormats): string;
  /**
   * Format a date using a format of the date library.
   * @param {SchedulerValidDate} value The date to format.
   * @param {string} formatString The format to use.
   * @returns {string} The stringify date.
   */
  formatByString(value: SchedulerValidDate, formatString: string): string;
  /**
   * Format a number to be rendered in the clock.
   * Is being used in hijri and jalali adapters.
   * @param {string} numberToFormat The number to format.
   * @returns {string} The formatted number.
   */
  formatNumber(numberToFormat: string): string;
  /**
   * Check if the two dates are equal (which means they represent the same timestamp).
   * @param {SchedulerValidDate | null} value The reference date.
   * @param {SchedulerValidDate | null} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are equal.
   */
  isEqual(value: SchedulerValidDate | null, comparing: SchedulerValidDate | null): boolean;
  /**
   * Check if the two dates are in the same year (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same year.
   */
  isSameYear(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the two dates are in the same month (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same month.
   */
  isSameMonth(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the two dates are in the same day (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same day.
   */
  isSameDay(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the two dates are at the same hour (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same hour.
   */
  isSameHour(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the reference date is after the second date.
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is after the second date.
   */
  isAfter(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the year of the reference date is after the year of the second date (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is after the year of the second date.
   */
  isAfterYear(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the day of the reference date is after the day of the second date (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is after the day of the second date.
   */
  isAfterDay(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the reference date is before the second date.
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is before the second date.
   */
  isBefore(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the year of the reference date is before the year of the second date (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is before the year of the second date.
   */
  isBeforeYear(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the day of the reference date is before the day of the second date (using the timezone of the reference date).
   * @param {SchedulerValidDate} value The reference date.
   * @param {SchedulerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is before the day of the second date.
   */
  isBeforeDay(value: SchedulerValidDate, comparing: SchedulerValidDate): boolean;
  /**
   * Check if the value is within the provided range.
   * @param {SchedulerValidDate} value The value to test.
   * @param {[SchedulerValidDate, SchedulerValidDate]} range The range in which the value should be.
   * @returns {boolean} `true` if the value is within the provided range.
   */
  isWithinRange(
    value: SchedulerValidDate,
    range: [SchedulerValidDate, SchedulerValidDate],
  ): boolean;
  /**
   * Return the start of the year for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The start of the year of the given date.
   */
  startOfYear(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the start of the month for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The start of the month of the given date.
   */
  startOfMonth(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the start of the week for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The start of the week of the given date.
   */
  startOfWeek(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the start of the day for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The start of the day of the given date.
   */
  startOfDay(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the end of the year for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The end of the year of the given date.
   */
  endOfYear(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the end of the month for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The end of the month of the given date.
   */
  endOfMonth(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the end of the week for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The end of the week of the given date.
   */
  endOfWeek(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Return the end of the day for the given date.
   * @param {SchedulerValidDate} value The original date.
   * @returns {SchedulerValidDate} The end of the day of the given date.
   */
  endOfDay(value: SchedulerValidDate): SchedulerValidDate;
  /**
   * Add the specified number of years to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of years to be added.
   * @returns {SchedulerValidDate} The new date with the years added.
   */
  addYears(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of months to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of months to be added.
   * @returns {SchedulerValidDate} The new date with the months added.
   */
  addMonths(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of weeks to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of weeks to be added.
   * @returns {SchedulerValidDate} The new date with the weeks added.
   */
  addWeeks(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of days to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of days to be added.
   * @returns {SchedulerValidDate} The new date with the days added.
   */
  addDays(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of hours to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of hours to be added.
   * @returns {SchedulerValidDate} The new date with the hours added.
   */
  addHours(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of minutes to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of minutes to be added.
   * @returns {SchedulerValidDate} The new date with the minutes added.
   */
  addMinutes(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Add the specified number of seconds to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} amount The amount of seconds to be added.
   * @returns {SchedulerValidDate} The new date with the seconds added.
   */
  addSeconds(value: SchedulerValidDate, amount: number): SchedulerValidDate;
  /**
   * Get the year of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The year of the given date.
   */
  getYear(value: SchedulerValidDate): number;
  /**
   * Get the month of the given date.
   * The value is 0-based, in the Gregorian calendar January = 0, February = 1, ...
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The month of the given date.
   */
  getMonth(value: SchedulerValidDate): number;
  /**
   * Get the date (day in the month) of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The date of the given date.
   */
  getDate(value: SchedulerValidDate): number;
  /**
   * Get the hours of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The hours of the given date.
   */
  getHours(value: SchedulerValidDate): number;
  /**
   * Get the minutes of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The minutes of the given date.
   */
  getMinutes(value: SchedulerValidDate): number;
  /**
   * Get the seconds of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The seconds of the given date.
   */
  getSeconds(value: SchedulerValidDate): number;
  /**
   * Get the milliseconds of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The milliseconds of the given date.
   */
  getMilliseconds(value: SchedulerValidDate): number;
  /**
   * Set the year to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} year The year of the new date.
   * @returns {SchedulerValidDate} The new date with the year set.
   */
  setYear(value: SchedulerValidDate, year: number): SchedulerValidDate;
  /**
   * Set the month to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} month The month of the new date.
   * @returns {SchedulerValidDate} The new date with the month set.
   */
  setMonth(value: SchedulerValidDate, month: number): SchedulerValidDate;
  /**
   * Set the date (day in the month) to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} date The date of the new date.
   * @returns {SchedulerValidDate} The new date with the date set.
   */
  setDate(value: SchedulerValidDate, date: number): SchedulerValidDate;
  /**
   * Set the hours to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} hours The hours of the new date.
   * @returns {SchedulerValidDate} The new date with the hours set.
   */
  setHours(value: SchedulerValidDate, hours: number): SchedulerValidDate;
  /**
   * Set the minutes to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} minutes The minutes of the new date.
   * @returns {SchedulerValidDate} The new date with the minutes set.
   */
  setMinutes(value: SchedulerValidDate, minutes: number): SchedulerValidDate;
  /**
   * Set the seconds to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} seconds The seconds of the new date.
   * @returns {SchedulerValidDate} The new date with the seconds set.
   */
  setSeconds(value: SchedulerValidDate, seconds: number): SchedulerValidDate;
  /**
   * Set the milliseconds to the given date.
   * @param {SchedulerValidDate} value The date to be changed.
   * @param {number} milliseconds The milliseconds of the new date.
   * @returns {SchedulerValidDate} The new date with the milliseconds set.
   */
  setMilliseconds(value: SchedulerValidDate, milliseconds: number): SchedulerValidDate;
  /**
   * Get the number of days in a month of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The number of days in the month
   */
  getDaysInMonth(value: SchedulerValidDate): number;
  /**
   * Create a nested list with all the days of the month of the given date grouped by week.
   * @param {SchedulerValidDate} value The given date.
   * @returns {SchedulerValidDate[][]} A nested list with all the days of the month grouped by week.
   */
  getWeekArray(value: SchedulerValidDate): SchedulerValidDate[][];
  /**
   * Get the number of the week of the given date.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The number of the week of the given date.
   */
  getWeekNumber(value: SchedulerValidDate): number;
  /**
   * Get the number of the day of the week of the given date.
   * The value is 1-based, 1 - first day of the week, 7 - last day of the week.
   * @param {SchedulerValidDate} value The given date.
   * @returns {number} The number of the day of the week of the given date.
   */
  getDayOfWeek(value: SchedulerValidDate): number;
  /**
   * Create a list with all the years between the start and the end date.
   * @param {[SchedulerValidDate, SchedulerValidDate]} range The range of year to create.
   * @returns {SchedulerValidDate[]} List of all the years between the start end the end date.
   */
  getYearRange(range: [SchedulerValidDate, SchedulerValidDate]): SchedulerValidDate[];
}
