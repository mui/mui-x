import {
  BaseDateValidationProps,
  BaseTimeValidationProps,
  MakeRequired,
} from '@mui/x-date-pickers/internals';
import { BaseSingleInputFieldProps, PickerValidDate } from '@mui/x-date-pickers/models';
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
import { UseDateTimeRangeFieldProps } from '../internals/models';
import { DateRange, DateTimeRangeValidationError, RangeFieldSection } from '../models';

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
> = MakeRequired<
  UseDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  | 'format'
  | 'timezone'
  | 'value'
  | 'ampm'
  | keyof BaseDateValidationProps<TDate>
  | keyof BaseTimeValidationProps
> &
  BaseSingleInputFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    false,
    DateTimeRangeValidationError
  >;
