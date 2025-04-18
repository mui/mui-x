import {
  EnhancedPickersDayOwnerState,
  EnhancedPickersDayProps,
} from '@mui/x-date-pickers/EnhancedPickersDay';
import { EnhancedDateRangePickerDayClasses } from './enhancedDateRangePickerDayClasses';

export interface EnhancedDateRangePickerDayProps extends Omit<EnhancedPickersDayProps, 'classes'> {
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isEndOfPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isStartOfPreviewing: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EnhancedDateRangePickerDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable?: boolean;
}

export interface EnhancedDateRangePickerDayOwnerState extends EnhancedPickersDayOwnerState {
  /**
   * Whether the day is the first day of the selected range.
   */
  isDaySelectionStart: boolean;
  /**
   * Whether the day is the last day of the selected range.
   */
  isDaySelectionEnd: boolean;
  /**
   * Whether the day is within the selected range and is not its first or last day.
   */
  isDayInsideSelection: boolean;
  /**
   * Whether the day is within the preview range.
   */
  isDayPreviewed: boolean;
  /**
   * Whether the day is the first day of the preview range.
   */
  isDayPreviewStart: boolean;
  /**
   * Whether the day is the last day of the preview range.
   */
  isDayPreviewEnd: boolean;
  /**
   * Whether the day is within the preview range and is not its first or last day.
   */
  isDayInsidePreview: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  isDayDraggable?: boolean;
  /**
   * Whether the day is the first day of the month.
   */
  isDayStartOfMonth: boolean;
  /**
   * Whether the day is the last day of the month.
   */
  isDayEndOfMonth: boolean;
  /**
   * Whether the day is the first visible cell of the month it's being rendered in.
   */
  isDayFirstVisibleCell: boolean;
  /**
   * Whether the day is the last visible cell of the month it's being rendered in.
   */
  isDayLastVisibleCell: boolean;
}
