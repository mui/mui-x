import { PickerValidDate } from '@mui/x-date-pickers/models';
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
import { DateRange, DateTimeRangeValidationError, RangeFieldSection } from '../models';
import type { ValidateDateTimeRangeProps } from '../validation';

export interface DateTimeRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateTimeRangePickerSlots<TDate>,
    MobileDateTimeRangePickerSlots<TDate> {}

export interface DateTimeRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopDateTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {}

export interface DateTimeRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends DesktopDateTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateTimeRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure> {
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
  slots?: DateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}

/**
 * Props the field can receive when used inside a `DateTimeRangePicker`, `DesktopDateTimeRangePicker` or `MobileDateTimeRangePicker` component.
 */
export type DateTimeRangePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = ValidateDateTimeRangeProps<TDate> &
  BaseSingleInputFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    TEnableAccessibleFieldDOMStructure,
    DateTimeRangeValidationError
  >;
