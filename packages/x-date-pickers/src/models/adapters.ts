import { FieldSectionType } from './fields';

export interface AdapterFormats<TLibFormatToken = string> {
  /** Localized full date @example "Jan 1, 2019" */
  fullDate: TLibFormatToken;
  /** Partially localized full date with weekday, useful for text-to-speech accessibility @example "Tuesday, January 1, 2019" */
  fullDateWithWeekday: TLibFormatToken;
  /** Date format string with month and day of month @example "1 January" */
  normalDate: TLibFormatToken;
  /** Date format string with weekday, month and day of month @example "Wed, Jan 1" */
  normalDateWithWeekday: TLibFormatToken;
  /** Shorter day format @example "Jan 1" */
  shortDate: TLibFormatToken;
  /** Year format string @example "2019" */
  year: TLibFormatToken;
  /** Month format string @example "January" */
  month: TLibFormatToken;
  /** Short month format string @example "Jan" */
  monthShort: TLibFormatToken;
  /** Month with year format string @example "January 2018" */
  monthAndYear: TLibFormatToken;
  /** Month with date format string @example "January 1" */
  monthAndDate: TLibFormatToken;
  /** Weekday format string @example "Wednesday" */
  weekday: TLibFormatToken;
  /** Short weekday format string @example "Wed" */
  weekdayShort: TLibFormatToken;
  /** Day format string @example "1" */
  dayOfMonth: TLibFormatToken;
  /** Hours format string @example "11" */
  hours12h: TLibFormatToken;
  /** Hours format string @example "23" */
  hours24h: TLibFormatToken;
  /** Minutes format string @example "44" */
  minutes: TLibFormatToken;
  /** Seconds format string @example "00" */
  seconds: TLibFormatToken;
  /** Full time localized format string @example "11:44 PM" for US, "23:44" for Europe */
  fullTime: TLibFormatToken;
  /** Not localized full time format string @example "11:44 PM" */
  fullTime12h: TLibFormatToken;
  /** Not localized full time format string @example "23:44" */
  fullTime24h: TLibFormatToken;
  /** Date & time format string with localized time @example "Jan 1, 2018 11:44 PM" */
  fullDateTime: TLibFormatToken;
  /** Not localized date & Time format 12h @example "Jan 1, 2018 11:44 PM" */
  fullDateTime12h: TLibFormatToken;
  /** Not localized date & Time format 24h @example "Jan 1, 2018 23:44" */
  fullDateTime24h: TLibFormatToken;
  /** Localized keyboard input friendly date format @example "02/13/2020 */
  keyboardDate: TLibFormatToken;
  /** Localized keyboard input friendly date/time format @example "02/13/2020 23:44" */
  keyboardDateTime: TLibFormatToken;
  /** Partially localized keyboard input friendly date/time 12h format @example "02/13/2020 11:44 PM" */
  keyboardDateTime12h: TLibFormatToken;
  /** Partially localized keyboard input friendly date/time 24h format @example "02/13/2020 23:44" */
  keyboardDateTime24h: TLibFormatToken;
}

export type AdapterUnits =
  | 'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export type FieldFormatTokenMap = {
  [formatToken: string]:
    | FieldSectionType
    | { sectionType: FieldSectionType; contentType: 'digit' | 'letter' };
};

export interface MuiPickersAdapter<TDate> {
  /**
   * A boolean confirming that the adapter used is an MUI adapter.
   */
  isMUIAdapter: boolean;
  formats: AdapterFormats<any>;
  locale?: any;
  moment?: any;
  dayjs?: any;
  /** Name of the library that is used right now */
  lib: string;
  /**
   * The characters used to escape a string inside a format.
   */
  escapedCharacters: { start: string; end: string };

  /**
   * A map containing all the format that the field components can understand.
   */
  formatTokenMap: FieldFormatTokenMap;

  // constructor (options?: { formats?: DateIOFormats, locale?: any, instance?: any });

  /**
   * Create a date in the date library format.
   * If no `value` parameter is provided, creates a date with the current timestamp.
   * If a `value` parameter is provided, pass it to the date library to try to parse it.
   * @template TDate
   * @param {any} value The optional value to parse.
   * @returns {TDate | null} The parsed date.
   */
  date(value?: any): TDate | null;
  /**
   * Convert a date in the library format into a JavaScript `Date` object.
   * @deprecate Will be removed in v7.
   * @template TDate
   * @param {TDate} value The value to convert.
   * @returns {Date} the JavaScript date.
   */
  toJsDate(value: TDate): Date;
  /**
   * Parse an iso string into a date in the date library format.
   * @deprecate Will be removed in v7.
   * @template TDate
   * @param {string} isoString The iso string to parse.
   * @returns {TDate} the parsed date.
   */
  parseISO(isoString: string): TDate;
  /**
   * Stringify a date in the date library format into an ISO string.
   * @deprecate Will be removed in v7.
   * @template TDate
   * @param {TDate} value The date to stringify.
   * @returns {string} the iso string representing the date.
   */
  toISO(value: TDate): string;
  /**
   * Parse a string date in a specific format.
   * @template TDate
   * @param {string} value The string date to parse.
   * @param {string} format The format in which the string date is.
   * @returns {TDate | null} The parsed date.
   */
  parse(value: string, format: string): TDate | null;
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
   * Create a user readable format (taking into account localized format tokens), useful to render helper text for input (e.g. placeholder).
   * @deprecated  Will be removed in v7.
   * @param {string} format The format to analyze.
   * @returns {string} The helper text of the given format.
   */
  getFormatHelperText(format: string): string;
  /**
   * Check if the date is null.
   * @deprecated  Will be removed in v7.
   * @template TDate
   * @param {TDate | null} value The date to test.
   * @returns {boolean} `true` if the date is null.
   */
  isNull(value: TDate | null): boolean;
  // TODO v7: Type `value` to be `TDate | null` and make sure the `isValid(null)` returns `false`.
  /**
   * Check if the date is valid.
   * @param {any} value The value to test.
   * @returns {boolean} `true` if the value is valid.
   */
  isValid(value: any): boolean;
  /**
   * Format a date using an adapter format string (see the `AdapterFormats` interface)
   * @template TDate
   * @param {TDate} value The date to format.
   * @param {keyof AdapterFormats} formatKey The formatKey to use.
   * @returns {string} The stringify date.
   */
  format(value: TDate, formatKey: keyof AdapterFormats): string;
  /**
   * Format a date using a format of the date library.
   * @template TDate
   * @param {TDate} value The date to format.
   * @param {string} formatString The format to use.
   * @returns {string} The stringify date.
   */
  formatByString(value: TDate, formatString: string): string;
  /**
   * Format a number to be rendered in the clock.
   * Is being used in hijri and jalali adapters.
   * @param {string} numberToFormat The number to format.
   * @returns {string} The formatted number.
   */
  formatNumber(numberToFormat: string): string;
  /**
   * Compute the difference between the two dates in the unit provided.
   * @deprecated  Will be removed in v7.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate | string} comparing The date to compare with the reference date.
   * @param {AdapterUnits} unit The unit in which we want to the result to be.
   * @returns {number} The diff between the two dates.
   */
  getDiff(value: TDate, comparing: TDate | string, unit?: AdapterUnits): number;
  // TODO v7: Type `value` and `comparing` to be `TDate | null`.
  /**
   * Check if the two dates are equal.
   * @param {any} value The reference date.
   * @param {any} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are equal.
   */
  isEqual(value: any, comparing: any): boolean;
  /**
   * Check if the two dates are in the same year.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same year.
   */
  isSameYear(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the two dates are in the same month.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same month.
   */
  isSameMonth(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the two dates are in the same day.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same day.
   */
  isSameDay(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the two dates are at the same hour.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the two dates are in the same hour.
   */
  isSameHour(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the reference date is after the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is after the second date.
   */
  isAfter(value: TDate, comparing: TDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the year of the reference date is after the year of the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is after the year of the second date.
   */
  isAfterYear(value: TDate, comparing: TDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isAfter` and drop this method.
  /**
   * Check if the day of the reference date is after the day of the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is after the day of the second date.
   */
  isAfterDay(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the reference date is before the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the reference date is before the second date.
   */
  isBefore(value: TDate, comparing: TDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the year of the reference date is before the year of the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the year of the reference date is before the year of the second date.
   */
  isBeforeYear(value: TDate, comparing: TDate): boolean;
  // TODO v7: Consider adding a `unit` param to `isBefore` and drop this method.
  /**
   * Check if the day of the reference date is before the day of the second date.
   * @template TDate
   * @param {TDate} value The reference date.
   * @param {TDate} comparing The date to compare with the reference date.
   * @returns {boolean} `true` if the day of the reference date is before the day of the second date.
   */
  isBeforeDay(value: TDate, comparing: TDate): boolean;
  /**
   * Check if the value is withing the provided range.
   * @template TDate
   * @param {TDate} value The value to test.
   * @param {[TDate, TDate]} range The range in which the value should be.
   * @returns {boolean} `true` if the value is within the provided range.
   */
  isWithinRange(value: TDate, range: [TDate, TDate]): boolean;
  /**
   * Return the start of the year for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The start of the year of the given date.
   */
  startOfYear(value: TDate): TDate;
  /**
   * Return the start of the month for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The start of the month of the given date.
   */
  startOfMonth(value: TDate): TDate;
  /**
   * Return the start of the week for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The start of the week of the given date.
   */
  startOfWeek(value: TDate): TDate;
  /**
   * Return the start of the day for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The start of the day of the given date.
   */
  startOfDay(value: TDate): TDate;
  /**
   * Return the end of the year for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The end of the year of the given date.
   */
  endOfYear(value: TDate): TDate;
  /**
   * Return the end of the month for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The end of the month of the given date.
   */
  endOfMonth(value: TDate): TDate;
  /**
   * Return the end of the week for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The end of the week of the given date.
   */
  endOfWeek(value: TDate): TDate;
  /**
   * Return the end of the day for the given date.
   * @template TDate
   * @param {TDate} value The original date.
   * @returns {TDate} The end of the day of the given date.
   */
  endOfDay(value: TDate): TDate;
  /**
   * Add the specified number of years to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of years to be added.
   * @returns {TDate} The new date with the years added.
   */
  addYears(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of months to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of months to be added.
   * @returns {TDate} The new date with the months added.
   */
  addMonths(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of weeks to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of weeks to be added.
   * @returns {TDate} The new date with the weeks added.
   */
  addWeeks(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of days to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of days to be added.
   * @returns {TDate} The new date with the days added.
   */
  addDays(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of hours to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of hours to be added.
   * @returns {TDate} The new date with the hours added.
   */
  addHours(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of minutes to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of minutes to be added.
   * @returns {TDate} The new date with the minutes added.
   */
  addMinutes(value: TDate, amount: number): TDate;
  /**
   * Add the specified number of seconds to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} amount The amount of seconds to be added.
   * @returns {TDate} The new date with the seconds added.
   */
  addSeconds(value: TDate, amount: number): TDate;
  /**
   * Get the year of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The year of the given date.
   */
  getYear(value: TDate): number;
  /**
   * Get the month of the given date.
   * The value is 0-based, in the Gregorian calendar January = 0, February = 1, ...
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The month of the given date.
   */
  getMonth(value: TDate): number;
  /**
   * Get the date (e.g: the day in the month) of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The date of the given date.
   */
  getDate(value: TDate): number;
  /**
   * Get the hours of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The hours of the given date.
   */
  getHours(value: TDate): number;
  /**
   * Get the minutes of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The minutes of the given date.
   */
  getMinutes(value: TDate): number;
  /**
   * Get the seconds of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The seconds of the given date.
   */
  getSeconds(value: TDate): number;
  /**
   * Set the year to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} year The year of the new date.
   * @returns {TDate} The new date with the year set.
   */
  setYear(value: TDate, year: number): TDate;
  /**
   * Set the month to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} month The month of the new date.
   * @returns {TDate} The new date with the month set.
   */
  setMonth(value: TDate, month: number): TDate;
  /**
   * Set the date (e.g: the day in the month) to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} date The date of the new date.
   * @returns {TDate} The new date with the date set.
   */
  setDate(value: TDate, date: number): TDate;
  /**
   * Set the hours to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} hours The hours of the new date.
   * @returns {TDate} The new date with the hours set.
   */
  setHours(value: TDate, hours: number): TDate;
  /**
   * Set the minutes to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} minutes The minutes of the new date.
   * @returns {TDate} The new date with the minutes set.
   */
  setMinutes(value: TDate, minutes: number): TDate;
  /**
   * Set the seconds to the given date.
   * @template TDate
   * @param {TDate} value The date to be changed.
   * @param {number} seconds The seconds of the new date.
   * @returns {TDate} The new date with the seconds set.
   */
  setSeconds(value: TDate, seconds: number): TDate;
  /**
   * Get the number of days in a month of the given date.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {number} The number of days in the month
   */
  getDaysInMonth(value: TDate): number;
  /**
   * Add one month to the given date.
   * @deprecated Use `addMonths(value, 1)`
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {TDate} The new date with one month added.
   */
  getNextMonth(value: TDate): TDate;
  /**
   * Subtract one month from the given date.
   * @deprecated Use `addMonths(value, -1)`
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {TDate} The new date with one month subtracted.
   */
  getPreviousMonth(value: TDate): TDate;
  // TODO: Inline the logic in a utility function using `addMonths`, we don't need one method per adapter.
  /**
   * Get an array with all the months in the year of the given date.
   * @deprecated Will be removed in v7.
   * @template TDate
   * @param {TDate} value The given date.
   * @returns {TDate[]} All the months in the year of the given date.
   */
  getMonthArray(value: TDate): TDate[];
  /**
   * Create a date with the date of the first param and the time of the second param.
   * @template TDate
   * @param {TDate} dateParam Param from which we want to get the date.
   * @param {TDate} timeParam Param from which we want to get the time.
   * @returns Date with the date of the first param and the time of the second param.
   */
  mergeDateAndTime(dateParam: TDate, timeParam: TDate): TDate;
  /**
   * Get the label of each day of a week.
   * @returns {string[]} The label of each day of a week.
   */
  getWeekdays(): string[];
  /**
   * Create a nested list with all the days of the month of the given date grouped by week.
   * @template TDate
   * @param {TDate} date The given date.
   * @returns {TDate[][]} A nested list with all the days of the month grouped by week.
   */
  getWeekArray(date: TDate): TDate[][];
  /**
   * Get the number of the week of the given date.
   * @template TDate
   * @param {TDate} date The given date.
   * @returns {number} The number of the week of the given date.
   */
  getWeekNumber(date: TDate): number;
  // TODO v7: Replace with a single range param `[TDate, TDate]`, to be coherent with `isWithingRange`.
  /**
   * Create a list with all the years between the start end the end date.
   * @template TDate
   * @param {TDate} start The start of the range.
   * @param {TDate} end The end of the range.
   * @returns {TDate[]} List of all the years between the start end the end date.
   */
  getYearRange(start: TDate, end: TDate): TDate[];
  /**
   * Allow to customize how the "am"` and "pm" strings are rendered.
   * @param {"am" | "pm"} meridiem The string to render.
   * @return {string} The formatted string.
   */
  getMeridiemText(meridiem: 'am' | 'pm'): string;
}
