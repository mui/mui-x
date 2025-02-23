export enum RangeCalendarDayCellDataAttributes {
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
   * Present when the day is within the selected range and is not its first or last day.
   */
  insideSelection = 'data-inside-selection',
  /**
   * Present when the day is within the preview range.
   */
  previewed = 'data-previewed',
  /**
   * Present when the day is the first day of the preview range.
   */
  previewStart = 'data-preview-start',
  /**
   * Present when the day is the last day of the preview range.
   */
  previewEnd = 'data-preview-end',
  /**
   * Present when the day is within the preview range and is not its first or last day.
   */
  insidePreview = 'data-inside-preview',
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
   * Present when the day is the first day of its week.
   */
  startOfWeek = 'data-start-of-week',
  /**
   * Present when the day is the last day of its week.
   */
  endOfWeek = 'data-end-of-week',
  /**
   * Present when the day is outside the month rendered by the day grid wrapping it.
   */
  outsideMonth = 'data-outside-month',
}
