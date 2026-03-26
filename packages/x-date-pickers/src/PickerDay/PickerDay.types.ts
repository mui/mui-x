import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { MuiEvent } from '@mui/x-internals/types';
import { PickerValidDate } from '../models';
import { PickerDayClasses } from './pickerDayClasses';
import { PickerDayOwnerState as PickerDayOwnerStateBase } from '../internals/hooks/PickerDay.types';

export interface ExportedPickerDayProps {
  /**
   * If `true`, today's day is not highlighted.
   * @default false
   */
  disableHighlightToday?: boolean;
  /**
   * If `true`, days outside the current month are shown.
   * @default false
   */
  showDaysOutsideCurrentMonth?: boolean;
}

export interface PickerDayProps
  extends
    ExportedPickerDayProps,
    Omit<
      ButtonBaseProps,
      'classes' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onMouseDown' | 'onClick' | 'onMouseEnter'
    > {
  /**
   * The date to show.
   */
  day: PickerValidDate;
  /**
   * If `true`, renders as selected.
   * @default false
   */
  selected?: boolean;
  /**
   * If `true`, the day is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, today's day is highlighted.
   * @default false
   */
  today?: boolean;
  /**
   * If `true`, the day is outside the current month.
   * @default false
   */
  outsideCurrentMonth: boolean;
  /**
   * If `true`, the day is the first visible cell of the month.
   * @default false
   */
  isFirstVisibleCell: boolean;
  /**
   * If `true`, the day is the last visible cell of the month.
   * @default false
   */
  isLastVisibleCell: boolean;
  /**
   * If `true`, the day is being animated.
   * @default false
   */
  isAnimating?: boolean;
  /**
   * Callback fired when the day is selected.
   * @param {PickerValidDate} day The day to select.
   */
  onDaySelect: (day: PickerValidDate) => void;
  /**
   * Callback fired when a key is pressed.
   * @param {React.KeyboardEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  /**
   * Callback fired when the component is focused.
   * @param {React.FocusEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  /**
   * Callback fired when the component is blurred.
   * @param {React.FocusEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  /**
   * Callback fired when the mouse enters the component.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  /**
   * Callback fired when the component is clicked.
   * @param {MuiEvent<React.MouseEvent<HTMLButtonElement>>} event The event object.
   * @default () => {}
   */
  onClick?: (event: MuiEvent<React.MouseEvent<HTMLButtonElement>>) => void;
  /**
   * Callback fired when the mouse button is pressed.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @default () => {}
   */
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickerDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
  /**
   * If `true`, the day is a filler day (its content is hidden).
   * @default false
   */
  isDayFillerCell?: boolean;
}

export interface PickerDayOwnerState extends PickerDayOwnerStateBase {
  /**
   * Whether the day is a filler day (its content is hidden).
   */
  isDayFillerCell?: boolean;
}

export type { PickerDayOwnerStateBase };
