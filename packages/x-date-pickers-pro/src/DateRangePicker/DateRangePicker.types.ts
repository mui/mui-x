import { BaseDateValidationProps, MakeRequired } from '@mui/x-date-pickers/internals';
import { BaseSingleInputFieldProps, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DesktopDateRangePickerProps,
  DesktopDateRangePickerSlots,
  DesktopDateRangePickerSlotProps,
} from '../DesktopDateRangePicker';
import {
  MobileDateRangePickerProps,
  MobileDateRangePickerSlots,
  MobileDateRangePickerSlotProps,
} from '../MobileDateRangePicker';
import {
  DateRange,
  DateRangeValidationError,
  RangeFieldSection,
  UseDateRangeFieldProps,
} from '../models';

export interface DateRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateRangePickerSlots<TDate>,
    MobileDateRangePickerSlots<TDate> {}

export interface DateRangePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopDateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {}

export interface DateRangePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends DesktopDateRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerProps<TDate, TEnableAccessibleFieldDOMStructure> {
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
  slots?: DateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}

/**
 * Props the field can receive when used inside a `DateRangePicker`, `DesktopDateRangePicker` or `MobileDateRangePicker` component.
 */
export type DateRangePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = MakeRequired<
  UseDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  'format' | 'timezone' | 'value' | keyof BaseDateValidationProps<TDate>
> &
  BaseSingleInputFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    false,
    DateRangeValidationError
  >;
