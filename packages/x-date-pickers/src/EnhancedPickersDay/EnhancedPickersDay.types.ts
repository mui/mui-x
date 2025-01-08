import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { ExportedPickersDayProps } from '../PickersDay/PickersDay';
import { EnhancedPickersDayClasses } from './enhancedPickersDayClasses';
import { PickerValidDate } from '../models/pickers';
import { ExtendMui } from '../internals/models/helpers';

interface RangeDayProps {
  /**
   * Set to `true` if the `day` is in a selected date range and is not the start or the end of the selected range.
   */
  isWithinSelectedRange: boolean;
  /**
   * Set to `true` if the `day` is the end of a selected date range.
   */
  isEndOfSelectedRange: boolean;
  /**
   * Set to `true` if the `day` is the start of a selected date range.
   */
  isStartOfSelectedRange: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range and is not the start or the end of the preview.
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
   * Indicates if the day should be visually selected.
   */
  isDragSelected?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable?: boolean;
}

export interface EnhancedPickersDayProps
  extends ExportedPickersDayProps,
    Omit<
      ExtendMui<ButtonBaseProps>,
      'onKeyDown' | 'onFocus' | 'onBlur' | 'onMouseEnter' | 'LinkComponent' | 'draggable'
    >,
    Partial<RangeDayProps> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EnhancedPickersDayClasses>;
  /**
   * The date to show.
   */
  day: PickerValidDate;
  /**
   * If `true`, renders as disabled.
   * @default false
   */
  disabled?: boolean;

  isAnimating?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  onDaySelect: (day: PickerValidDate) => void;
  /**
   * If `true`, day is outside of month and will be hidden.
   */
  outsideCurrentMonth: boolean;
  /**
   * If `true`, day is the first visible cell of the month.
   * Either the first day of the month or the first day of the week depending on `showDaysOutsideCurrentMonth`.
   */
  isFirstVisibleCell: boolean;
  /**
   * If `true`, day is the last visible cell of the month.
   * Either the last day of the month or the last day of the week depending on `showDaysOutsideCurrentMonth`.
   */
  isLastVisibleCell: boolean;
  /**
   * If `true`, renders as selected.
   * @default false
   */
  selected?: boolean;
  /**
   * If `true`, renders as today date.
   * @default false
   */
  today?: boolean;
  /**
   * The number of the day in the week.
   */
  dayOfWeek: number;
}

export type PickersDayOwnerState = {
  /**
   * If `true`, the day has visibility:' hidden'.
   * Usually needed for days outside the current month, if we don't want to show them .
   */
  isDayHidden?: boolean;
  /**
   * True if the day is the last day of the week (last column of the week container).
   */
  isLastDayOfWeek?: boolean;
  /**
   * True if the day is the first day of the week (first column of the week container).
   */
  isFirstDayOfWeek?: boolean;
  /**
   * True if the day is selected.
   * Used for both range and simple calendars.
   */
  isSelected: boolean;
  /**
   * If `true` the current day will not be highlighted.
   */
  isHighlightTodayDisabled: boolean;
  /**
   * If `true`, the day is the current day.
   */
  isToday: boolean;
  /**
   * If `true`, the day is disabled.
   */
  isDisabled: boolean;
  /**
   * If `true`, the day is outside the month that is currently in view.
   */
  isOutsideCurrentMonth: boolean;
  /**
   * If `true`, the day is the start hover range preview.
   */
  isStartOfPreviewing: boolean;
  /**
   * If `true`, the day is the end hover range preview.
   */
  isEndOfPreviewing: boolean;
  /**
   * If `true`, the day is in the hover range preview  - excluding the start and the end.
   */
  isPreviewing: boolean;
  /**
   * If `true`, the day is the start of the selected range.
   * isSelected should be `true` as well.
   */
  isStartOfSelectedRange: boolean;
  /**
   * If `true`, the day is the end of the selected range.
   * isSelected should be `true` as well.
   */
  isEndOfSelectedRange: boolean;
  /**
   * If `true`, the day is in the selected range - excluding the start and the end.
   */
  isWithinSelectedRange: boolean;
  /**
   * If `true`, the day is being dragged.
   */
  isDragSelected: boolean;
};
