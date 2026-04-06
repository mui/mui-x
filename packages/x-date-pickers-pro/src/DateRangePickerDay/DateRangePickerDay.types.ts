import { PickerDayOwnerState, PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { MuiEvent } from '@mui/x-internals/types';
import { DateRangePickerDayClasses } from './dateRangePickerDayClasses';

export interface DateRangePickerDayProps extends Omit<PickerDayProps, 'classes'> {
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting?: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting?: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting?: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing?: boolean;
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isEndOfPreviewing?: boolean;
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isStartOfPreviewing?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangePickerDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  draggable?: boolean;
  /**
   * If `true`, the day is a filler day (its content is hidden).
   * @default false
   */
  isDayFillerCell?: boolean;
  /**
   * Callback fired when the mouse enters the component.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>, day: PickerValidDate) => void;
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
   * Callback fired when a key is pressed.
   * @param {React.KeyboardEvent<HTMLButtonElement>} event The event object.
   * @param {PickerValidDate} day The day.
   * @default () => {}
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, day: PickerValidDate) => void;
  /**
   * Callback fired when the mouse button is pressed.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event object.
   * @default () => {}
   */
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when the component is clicked.
   * @param {MuiEvent<React.MouseEvent<HTMLButtonElement>>} event The event object.
   * @default () => {}
   */
  onClick?: (event: MuiEvent<React.MouseEvent<HTMLButtonElement>>) => void;
}

export interface DateRangePickerDayOwnerState extends PickerDayOwnerState {
  /**
   * Whether the day is the first day of the selected range.
   */
  isDaySelectionStart?: boolean;
  /**
   * Whether the day is the last day of the selected range.
   */
  isDaySelectionEnd?: boolean;
  /**
   * Whether the day is within the selected range and is not its first or last day.
   */
  isDayInsideSelection?: boolean;
  /**
   * Whether the day is within the preview range.
   */
  isDayPreviewed?: boolean;
  /**
   * Whether the day is the first day of the preview range.
   */
  isDayPreviewStart?: boolean;
  /**
   * Whether the day is the last day of the preview range.
   */
  isDayPreviewEnd?: boolean;
  /**
   * Whether the day is within the preview range and is not its first or last day.
   */
  isDayInsidePreview?: boolean;
  /**
   * If `true`, the day can be dragged to change the current date range.
   * @default false
   */
  isDayDraggable?: boolean;
  /**
   * Whether the day is the first day of the month.
   */
  isDayStartOfMonth?: boolean;
  /**
   * Whether the day is the last day of the month.
   */
  isDayEndOfMonth?: boolean;
  /**
   * Whether the day is the first visible cell of the month it's being rendered in.
   */
  isDayFirstVisibleCell?: boolean;
  /**
   * Whether the day is the last visible cell of the month it's being rendered in.
   */
  isDayLastVisibleCell?: boolean;
}
