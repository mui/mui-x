/**
 * Definition of a tick frequency for time ordinal axes.
 */
export type TickFrequencyDefinition = {
  /**
   * Returns the number of ticks in the given date range for this tick frequency.
   * @param {Date} from The first date of the range.
   * @param {Date} to The last date of the range.
   * @returns {number} The number of ticks in the [from, to] range.
   */
  getTickNumber: (from: Date, to: Date) => number;
  /**
   * Indicate if the current date is a tick based on the previous date.
   * @param {Date} prev The date before the current date.
   * @param {Date} value The current date to check.
   * @returns {boolean} Whether the current date is a tick or not.
   */
  isTick: (prev: Date, value: Date) => boolean;
  /**
   * Format the tick value for display.
   * @param {Date} date The tick value to format.
   * @returns {string} The formatted date string.
   */
  format: (date: Date) => string;
};

/**
 * The predefined tick frequencies for time ordinal axes.
 * - 'years': ticks at the start of each year
 * - 'quarterly': ticks at the start of each quarter
 * - 'months': ticks at the start of each month
 * - 'biweekly': ticks every two weeks
 * - 'weeks': ticks at the start of each week
 * - 'days': ticks at the start of each day
 * - 'hours': ticks at the start of each hour
 */
export type TicksFrequency =
  | 'years'
  | 'quarterly'
  | 'months'
  | 'biweekly'
  | 'weeks'
  | 'days'
  | 'hours';

export type TimeOrdinalTicks = (TickFrequencyDefinition | TicksFrequency)[];
