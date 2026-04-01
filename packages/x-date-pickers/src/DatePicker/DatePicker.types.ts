import {
  DesktopDatePickerProps,
  DesktopDatePickerSlots,
  DesktopDatePickerSlotProps,
} from '../DesktopDatePicker';
import { BaseSingleInputFieldProps } from '../internals/models';
import {
  MobileDatePickerProps,
  MobileDatePickerSlots,
  MobileDatePickerSlotProps,
} from '../MobileDatePicker';
import { ValidateDateProps } from '../validation/validateDate';

export interface DatePickerSlots extends DesktopDatePickerSlots, MobileDatePickerSlots {}

export interface DatePickerSlotProps
  extends
    DesktopDatePickerSlotProps,
    MobileDatePickerSlotProps {}

export interface DatePickerProps
  extends
    DesktopDatePickerProps,
    MobileDatePickerProps {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DatePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotProps;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
}

/**
 * Props the field can receive when used inside a Date Picker (<DatePicker />, <DesktopDatePicker /> or <MobileDatePicker /> component).
 */
export type DatePickerFieldProps = ValidateDateProps & BaseSingleInputFieldProps;
