import { MakeRequired } from '@mui/x-internals/types';
import { UseDateFieldProps } from '../DateField';
import {
  DesktopDatePickerProps,
  DesktopDatePickerSlots,
  DesktopDatePickerSlotProps,
} from '../DesktopDatePicker';
import { BaseDateValidationProps } from '../internals/models/validation';
import {
  MobileDatePickerProps,
  MobileDatePickerSlots,
  MobileDatePickerSlotProps,
} from '../MobileDatePicker';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
  PickerValidDate,
} from '../models';

export interface DatePickerSlots extends DesktopDatePickerSlots, MobileDatePickerSlots {}

export interface DatePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopDatePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileDatePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface DatePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopDatePickerProps<TEnableAccessibleFieldDOMStructure>,
    MobileDatePickerProps<TEnableAccessibleFieldDOMStructure> {
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
  slotProps?: DatePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
}

/**
 * Props the field can receive when used inside a `DatePicker`, `DesktopDatePicker` or `MobileDatePicker` component.
 */
export type DatePickerFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  MakeRequired<
    UseDateFieldProps<TEnableAccessibleFieldDOMStructure>,
    'format' | 'timezone' | 'value' | keyof BaseDateValidationProps
  > &
    BaseSingleInputFieldProps<PickerValidDate | null, FieldSection, false, DateValidationError>;
