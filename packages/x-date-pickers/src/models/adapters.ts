import { FieldSectionContentType, FieldSectionType } from './fields';
import { PickersTimezone } from './timezone';
import { PickerValidDate } from './pickers';

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
   * @example "02/13/2020
   */
  keyboardDate: string;
  /**
   * The abbreviated month name and the day of the month.
   * Used in the `DateRangePicker` toolbar.
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
   * The hours and the minutes.
   * Used for the aria-label of the opening button of the `TimePicker`.
   * @example "11:44 PM" for locales with meridiem, "23:44" for locales without meridiem.
   */
  fullTime: string;
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
   * A keyboard input friendly time format.
   * Used in the date-time fields.
   * @example "02/13/2020 11:44 PM" for locales with meridiem, "02/13/2020 23:44" for locales without meridiem.
   */
  keyboardDateTime: string;
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
  : PickerValidDate;

export interface MuiPickersAdapter<TLocale = any> {
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
   * @param {PickersTimezone} timezone The timezone of the date. Default: "default"
   * @returns {PickerValidDate | null} The parsed date.
   */
  date<T extends string | null | undefined>(
    value?: T,
    timezone?: PickersTimezone,
  ): DateBuilderReturnType<T>;
  /**
   * Creates an invalid date in the date library format.
   * @returns {PickerValidDate} The invalid date.
   */
  getInvalidDate(): PickerValidDate;
  /**
   * Extracts the timezone from a date.
   * @param {PickerValidDate | null} value The date from which we want to get the timezone.
   * @returns {PickerValidDate} The timezone of the date.
   */
  getTimezone(value: PickerValidDate | null): PickersTimezone;
  /**
   * Convert a date to another timezone.
   * @param {PickerValidDate} value The date to convert.
   * @param {PickersTimezone} timezone The timezone to convert the date to.
   * @returns {PickerValidDate} The converted date.
   */
  setTimezone(value: PickerValidDate, timezone: PickersTimezone): PickerValidDate;
  /**
   * Convert a date in the library format into a JavaScript `Date` object.
   * @param {PickerValidDate} value The value to convert.
   * @returns {PickerValidDate} the JavaScript date.
   */
  toJsDate(value: PickerValidDate): Date;
  /**
   * Parse a string date in a specific format.
   * @param {string} value The string date to parse.
   * @param {string} format The format in which the string date is.
   * @returns {PickerValidDate | null} The parsed date.
   */
  parse(value: string, format: string): PickerValidDate | null;
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
   * Create a format with no meta-token (e.g: `LLL` or `PP`).
   * @param {string} format The format to expand.
   * @returns {string} The expanded format.
   */
  expandFormat(format: string): string;
  /**
   * Check if the date is valid.
   * @param {PickerValidDate | null} value The value to test.
   * @returns {boolean} `true` if the value is a valid date according to the date library.
   */
  isValid(value: PickerValidDate | null): boolean;
  /**
   * Format a date using an adapter format string (see the `AdapterFormats` interface)
   * @param {PickerValidDate} value The date to format.
   * @param {keyof AdapterFormats} formatKey The formatKey to use.
   * @returns {string} The stringify date.
   */
  format(value: PickerValidDate, formatKey: keyof AdapterFormats): string;
  /**
   * Format a date using a format of the date library.
   * @param {PickerValidDate} value The date to format.
   * @param {string} formatString The format to use.
   * @returns {string} The stringify date.
   */
  formatByString(value: PickerValidDate, formatString: string): string;
  /**
   * Format a number to be rendered in the clock.
   * Is being used in hijri and jalali adapters.
   * @param {string} numberToFormat The number to format.
   * @returns {string} The formatted number.
   */
  formatNumber(numberToFormat: string): string;
  /**
   * Check if the two dates are equal (e.g: they represent the same timestamp).
   * @param {PickerValidDate | null} value The reference date.
   * @param {PickerValidDate | null} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are equal.
   */
  isEqual(value: PickerValidDate | null, comparing: PickerValidDate | null): boolean;
  /**
   * Check if the two dates are in the same year (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same year.
   */
  isSameYear(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the two dates are in the same month (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same month.
   */
  isSameMonth(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the two dates are in the same day (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same day.
   */
  isSameDay(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the two dates are at the same hour (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same hour.
   */
  isSameHour(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the reference date is after the second date.
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is after the second date.
   */
  isAfter(value: PickerValidDate, comparing: PickerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the year of the reference date is after the year of the second date (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is after the year of the second date.
   */
  isAfterYear(value: PickerValidDate, comparing: PickerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the day of the reference date is after the day of the second date (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is after the day of the second date.
   */
  isAfterDay(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the reference date is before the second date.
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is before the second date.
   */
  isBefore(value: PickerValidDate, comparing: PickerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the year of the reference date is before the year of the second date (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is before the year of the second date.
   */
  isBeforeYear(value: PickerValidDate, comparing: PickerValidDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the day of the reference date is before the day of the second date (using the timezone of the reference date).
   * @param {PickerValidDate} value The reference date.
   * @param {PickerValidDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is before the day of the second date.
   */
  isBeforeDay(value: PickerValidDate, comparing: PickerValidDate): boolean;
  /**
   * Check if the value is within the provided range.
   * @param {PickerValidDate} value The value to test.
   * @param {[PickerValidDate, PickerValidDate]} range The range in which the value should be.
   * @returns {boolean} `true` if the value is within the provided range.
   */
  isWithinRange(value: PickerValidDate, range: [PickerValidDate, PickerValidDate]): boolean;
  /**
   * Return the start of the year for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The start of the year of the given date.
   */
  startOfYear(value: PickerValidDate): PickerValidDate;
  /**
   * Return the start of the month for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The start of the month of the given date.
   */
  startOfMonth(value: PickerValidDate): PickerValidDate;
  /**
   * Return the start of the week for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The start of the week of the given date.
   */
  startOfWeek(value: PickerValidDate): PickerValidDate;
  /**
   * Return the start of the day for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The start of the day of the given date.
   */
  startOfDay(value: PickerValidDate): PickerValidDate;
  /**
   * Return the end of the year for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The end of the year of the given date.
   */
  endOfYear(value: PickerValidDate): PickerValidDate;
  /**
   * Return the end of the month for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The end of the month of the given date.
   */
  endOfMonth(value: PickerValidDate): PickerValidDate;
  /**
   * Return the end of the week for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The end of the week of the given date.
   */
  endOfWeek(value: PickerValidDate): PickerValidDate;
  /**
   * Return the end of the day for the given date.
   * @param {PickerValidDate} value The original date.
   * @returns {PickerValidDate} The end of the day of the given date.
   */
  endOfDay(value: PickerValidDate): PickerValidDate;
  /**
   * Add the specified number of years to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of years to be added.
   * @returns {PickerValidDate} The new date with the years added.
   */
  addYears(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of months to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of months to be added.
   * @returns {PickerValidDate} The new date with the months added.
   */
  addMonths(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of weeks to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of weeks to be added.
   * @returns {PickerValidDate} The new date with the weeks added.
   */
  addWeeks(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of days to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of days to be added.
   * @returns {PickerValidDate} The new date with the days added.
   */
  addDays(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of hours to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of hours to be added.
   * @returns {PickerValidDate} The new date with the hours added.
   */
  addHours(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of minutes to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of minutes to be added.
   * @returns {PickerValidDate} The new date with the minutes added.
   */
  addMinutes(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Add the specified number of seconds to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} amount The amount of seconds to be added.
   * @returns {PickerValidDate} The new date with the seconds added.
   */
  addSeconds(value: PickerValidDate, amount: number): PickerValidDate;
  /**
   * Get the year of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The year of the given date.
   */
  getYear(value: PickerValidDate): number;
  /**
   * Get the month of the given date.
   * The value is 0-based, in the Gregorian calendar January = 0, February = 1, ...
   * @param {PickerValidDate} value The given date.
   * @returns {number} The month of the given date.
   */
  getMonth(value: PickerValidDate): number;
  /**
   * Get the date (e.g: the day in the month) of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The date of the given date.
   */
  getDate(value: PickerValidDate): number;
  /**
   * Get the hours of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The hours of the given date.
   */
  getHours(value: PickerValidDate): number;
  /**
   * Get the minutes of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The minutes of the given date.
   */
  getMinutes(value: PickerValidDate): number;
  /**
   * Get the seconds of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The seconds of the given date.
   */
  getSeconds(value: PickerValidDate): number;
  /**
   * Get the milliseconds of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The milliseconds of the given date.
   */
  getMilliseconds(value: PickerValidDate): number;
  /**
   * Set the year to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} year The year of the new date.
   * @returns {PickerValidDate} The new date with the year set.
   */
  setYear(value: PickerValidDate, year: number): PickerValidDate;
  /**
   * Set the month to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} month The month of the new date.
   * @returns {PickerValidDate} The new date with the month set.
   */
  setMonth(value: PickerValidDate, month: number): PickerValidDate;
  /**
   * Set the date (e.g: the day in the month) to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} date The date of the new date.
   * @returns {PickerValidDate} The new date with the date set.
   */
  setDate(value: PickerValidDate, date: number): PickerValidDate;
  /**
   * Set the hours to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} hours The hours of the new date.
   * @returns {PickerValidDate} The new date with the hours set.
   */
  setHours(value: PickerValidDate, hours: number): PickerValidDate;
  /**
   * Set the minutes to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} minutes The minutes of the new date.
   * @returns {PickerValidDate} The new date with the minutes set.
   */
  setMinutes(value: PickerValidDate, minutes: number): PickerValidDate;
  /**
   * Set the seconds to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} seconds The seconds of the new date.
   * @returns {PickerValidDate} The new date with the seconds set.
   */
  setSeconds(value: PickerValidDate, seconds: number): PickerValidDate;
  /**
   * Set the milliseconds to the given date.
   * @param {PickerValidDate} value The date to be changed.
   * @param {number} milliseconds The milliseconds of the new date.
   * @returns {PickerValidDate} The new date with the milliseconds set.
   */
  setMilliseconds(value: PickerValidDate, milliseconds: number): PickerValidDate;
  /**
   * Get the number of days in a month of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The number of days in the month
   */
  getDaysInMonth(value: PickerValidDate): number;
  /**
   * Create a nested list with all the days of the month of the given date grouped by week.
   * @param {PickerValidDate} value The given date.
   * @returns {PickerValidDate[][]} A nested list with all the days of the month grouped by week.
   */
  getWeekArray(value: PickerValidDate): PickerValidDate[][];
  /**
   * Get the number of the week of the given date.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The number of the week of the given date.
   */
  getWeekNumber(value: PickerValidDate): number;
  /**
   * Get the number of the day of the week of the given date.
   * The value is 1-based, 1 - first day of the week, 7 - last day of the week.
   * @param {PickerValidDate} value The given date.
   * @returns {number} The number of the day of the week of the given date.
   */
  getDayOfWeek(value: PickerValidDate): number;
  /**
   * Create a list with all the years between the start and the end date.
   * @param {[PickerValidDate, PickerValidDate]} range The range of year to create.
   * @returns {PickerValidDate[]} List of all the years between the start end the end date.
   */
  getYearRange(range: [PickerValidDate, PickerValidDate]): PickerValidDate[];
}
