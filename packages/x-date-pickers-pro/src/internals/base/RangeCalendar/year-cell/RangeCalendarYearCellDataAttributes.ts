export enum RangeCalendarYearCellDataAttributes {
  /**
   * Present when the year is within the selected range.
   */
  selected = 'data-selected',
  /**
   * Present when the year is the first year of the selected range.
   */
  selectionStart = 'data-selection-start',
  /**
   * Present when the year is the last year of the selected range.
   */
  selectionEnd = 'data-selection-end',
  /**
   * Present when the year is within the selected range and is not its first or last year.
   */
  insideSelection = 'data-inside-selection',
  /**
   * Present when the year is within the preview range.
   */
  previewed = 'data-previewed',
  /**
   * Present when the year is the first year of the preview range.
   */
  previewStart = 'data-preview-start',
  /**
   * Present when the year is the last year of the preview range.
   */
  previewEnd = 'data-preview-end',
  /**
   * Present when the year is within the preview range and is not its first or last year.
   */
  insidePreview = 'data-inside-preview',
  /**
   * Present when the year is disabled.
   */
  disabled = 'data-disabled',
  /**
   * Present when the year is invalid.
   */
  invalid = 'data-invalid',
  /**
   * Present when the year is the current date.
   */
  current = 'data-current',
}
