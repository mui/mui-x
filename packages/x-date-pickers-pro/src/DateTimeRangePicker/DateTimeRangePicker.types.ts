import { BaseSingleInputFieldProps, PickerRangeValue } from '@mui/x-date-pickers/internals';
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
import { DateTimeRangeValidationError } from '../models';
import type { ValidateDateTimeRangeProps } from '../validation';

export interface DateTimeRangePickerSlots
  extends DesktopDateTimeRangePickerSlots,
    MobileDateTimeRangePickerSlots {}

export interface DateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface DateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateTimeRangePickerProps<TEnableAccessibleFieldDOMStructure> {
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
  slotProps?: DateTimeRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}

/**
 * Props the field can receive when used inside a date time range picker (<DateTimeRangePicker />, <DesktopDateTimeRangePicker /> or <MobileDateTimeRangePicker /> component).
 */
export type DateTimeRangePickerFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = ValidateDateTimeRangeProps &
  BaseSingleInputFieldProps<
    PickerRangeValue,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError
  >;
