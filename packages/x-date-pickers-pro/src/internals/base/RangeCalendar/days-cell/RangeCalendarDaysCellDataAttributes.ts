export enum RangeCalendarDaysCellDataAttributes {
  /**
   * Present when the day is within the selected range.
   */
  selected = 'data-selected',
  /**
   * Present when the day is the first day of the selected range.
   */
  selectionStart = 'data-selection-start',
  /**
   * Present when the day is the last day of the selected range.
   */
  selectionEnd = 'data-selection-end',
  /**
   * Present when the day is disabled.
   */
  disabled = 'data-disabled',
  /**
   * Present when the day is invalid.
   */
  invalid = 'data-invalid',
  /**
   * Present when the day is the current date.
   */
  current = 'data-current',
  /**
   * Present when the day is outside the month rendered by the day grid wrapping it.
   */
  outsideMonth = 'data-outside-month',
}
