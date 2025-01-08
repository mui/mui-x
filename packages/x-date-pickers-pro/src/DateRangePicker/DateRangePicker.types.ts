import { BaseSingleInputFieldProps, PickerRangeValue } from '@mui/x-date-pickers/internals';
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
import { DateRangeValidationError } from '../models';
import { ValidateDateRangeProps } from '../validation';

export interface DateRangePickerSlots
  extends DesktopDateRangePickerSlots,
    MobileDateRangePickerSlots {}

export interface DateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface DateRangePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDateRangePickerProps<TEnableAccessibleFieldDOMStructure>,
    MobileDateRangePickerProps<TEnableAccessibleFieldDOMStructure> {
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
  slots?: DateRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect?: boolean;
}

/**
 * Props the field can receive when used inside a date range picker (<DateRangePicker />, <DesktopDateRangePicker /> or <MobileDateRangePicker /> component).
 */
export type DateRangePickerFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  ValidateDateRangeProps &
    BaseSingleInputFieldProps<
      PickerRangeValue,
      TEnableAccessibleFieldDOMStructure,
      DateRangeValidationError
    >;
