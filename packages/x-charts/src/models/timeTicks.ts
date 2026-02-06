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
   * Decides if the current date should be shown as a tick.
   * @param {Date} prev The date before the current date.
   * @param {Date} value The current date to check.
   * @returns {boolean} Whether the current date is a tick or not.
   */
  isTick: (prev: Date, value: Date) => boolean;
  /**
   * Decides whether the first tick should be shown depending on its value.
   * @param {Date} value The first tick value.
   * @returns {boolean} Whether the first tick should be shown or not.
   */
  shouldShowFirstTick: (value: Date) => boolean;
  /**
   * Format the tick value for display.
   * @param {Date} date The tick value to format.
   * @returns {string} The formatted date string.
   */
  format: (date: Date) => string;
};

/**
 * The predefined tick frequencies for time ordinal axes.
 * - 'years': displays the year, placing ticks at the start of each year
 * - 'quarterly': displays the month, placing ticks at the start of each quarter
 * - 'months': displays the month, placing ticks at the start of each month
 * - 'biweekly': displays the day, placing ticks every two weeks
 * - 'weeks': displays the day, placing ticks at the start of each week
 * - 'days': displays the day, placing ticks at the start of each day
 * - 'hours': displays the hour and minutes, placing ticks at the start of each hour
 */
export type TickFrequency =
  | 'years'
  | 'quarterly'
  | 'months'
  | 'biweekly'
  | 'weeks'
  | 'days'
  | 'hours';

export type OrdinalTimeTicks = (TickFrequencyDefinition | TickFrequency)[];
