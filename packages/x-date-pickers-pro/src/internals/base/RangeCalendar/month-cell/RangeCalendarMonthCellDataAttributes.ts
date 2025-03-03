export enum RangeCalendarMonthCellDataAttributes {
  /**
   * Present when the month is within the selected range.
   */
  selected = 'data-selected',
  /**
   * Present when the month is the first month of the selected range.
   */
  selectionStart = 'data-selection-start',
  /**
   * Present when the month is the last month of the selected range.
   */
  selectionEnd = 'data-selection-end',
  /**
   * Present when the month is within the selected range and is not its first or last month.
   */
  insideSelection = 'data-inside-selection',
  /**
   * Present when the month is within the preview range.
   */
  previewed = 'data-previewed',
  /**
   * Present when the month is the first month of the preview range.
   */
  previewStart = 'data-preview-start',
  /**
   * Present when the month is the last month of the preview range.
   */
  previewEnd = 'data-preview-end',
  /**
   * Present when the month is within the preview range and is not its first or last month.
   */
  insidePreview = 'data-inside-preview',
  /**
   * Present when the month is disabled.
   */
  disabled = 'data-disabled',
  /**
   * Present when the month is invalid.
   */
  invalid = 'data-invalid',
  /**
   * Present when the month is the current date.
   */
  current = 'data-current',
}
