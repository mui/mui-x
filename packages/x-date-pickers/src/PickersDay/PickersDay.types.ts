import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { PickerOwnerState, PickerValidDate } from '../models/pickers';
import { ExtendMui } from '../internals/models/helpers';
import { PickersDayClasses } from './pickersDayClasses';

export interface PickerDayOwnerState extends PickerOwnerState {
  /**
   * The object representing the day.
   */
  day: PickerValidDate;
  /**
   * Whether the day is selected.
   */
  isDaySelected: boolean;
  /**
   * Whether the day is disabled.
   */
  isDayDisabled: boolean;
  /**
   * Whether the day is equal to today.
   */
  isDayCurrent: boolean;
  /**
   * Whether the day is outside the month it's being rendered in.
   */
  isDayOutsideMonth: boolean;
  /**
   * Whether the day is the first day of the week.
   */
  isDayStartOfWeek: boolean;
  /**
   * Whether the day is the last day of the week.
   */
  isDayEndOfWeek: boolean;
  /**
   * Whether the margin around the day should be removed.
   */
  disableMargin: boolean;
  /**
   * Whether the visual indication around the current day should be removed.
   */
  disableHighlightToday: boolean;
  /**
   * Whether the day outside of the month they are being rendered in should be visible.
   */
  showDaysOutsideCurrentMonth: boolean;
}

export interface ExportedPickersDayProps {
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  /**
   * If `true`, days outside the current month are rendered:
   *
   * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
   *
   * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
   *
   * - ignored if `calendars` equals more than `1` on range pickers.
   * @default false
   */
  showDaysOutsideCurrentMonth?: boolean;
}

export interface PickersDayProps
  extends ExportedPickersDayProps,
    Omit<
      ExtendMui<ButtonBaseProps>,
      'onKeyDown' | 'onFocus' | 'onBlur' | 'onMouseEnter' | 'LinkComponent'
    > {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersDayClasses>;
  /**
   * The date to show.
   */
  day: PickerValidDate;
  /**
   * If `true`, renders as disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, days are rendering without margin. Useful for displaying linked range of days.
   * @default false
   */
  disableMargin?: boolean;
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
}
