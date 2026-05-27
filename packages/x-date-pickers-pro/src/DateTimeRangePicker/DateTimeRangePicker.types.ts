import { BaseSingleInputFieldProps } from '@mui/x-date-pickers/internals';
import {
  DesktopDateTimeRangePickerProps,
  DesktopDateTimeRangePickerSlots,
  DesktopDateTimeRangePickerSlotProps,
} from '../DesktopDateTimeRangePicker';
import {
  MobileDateTimeRangePickerProps,
  MobileDateTimeRangePickerSlots,
  MobileDateTimeRangePickerSlotProps,
} from '../MobileDateTimeRangePicker';
import type { ValidateDateTimeRangeProps } from '../validation';

export interface DateTimeRangePickerSlots
  extends DesktopDateTimeRangePickerSlots, MobileDateTimeRangePickerSlots {}

export interface DateTimeRangePickerSlotProps
  extends DesktopDateTimeRangePickerSlotProps, MobileDateTimeRangePickerSlotProps {}

export interface DateTimeRangePickerProps
  extends DesktopDateTimeRangePickerProps, MobileDateTimeRangePickerProps {
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
  slots?: DateTimeRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeRangePickerSlotProps;
}

/**
 * Props the field can receive when used inside a Date Time Range Picker (<DateTimeRangePicker />, <DesktopDateTimeRangePicker /> or <MobileDateTimeRangePicker /> component).
 */
export type DateTimeRangePickerFieldProps = ValidateDateTimeRangeProps & BaseSingleInputFieldProps;
