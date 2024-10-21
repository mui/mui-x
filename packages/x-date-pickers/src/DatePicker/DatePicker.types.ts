import { UseDateFieldProps } from '../DateField';
import {
  DesktopDatePickerProps,
  DesktopDatePickerSlots,
  DesktopDatePickerSlotProps,
} from '../DesktopDatePicker';
import { DefaultizedProps } from '../internals/models/helpers';
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

export interface DatePickerSlots<TDate extends PickerValidDate>
  extends DesktopDatePickerSlots<TDate>,
    MobileDatePickerSlots<TDate> {}

export interface DatePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {}

export interface DatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends DesktopDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure> {
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
  slots?: DatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
}

/**
 * Props the field can receive when used inside a `DatePicker`, `DesktopDatePicker` or `MobileDatePicker` component.
 */
export type DatePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = DefaultizedProps<
  UseDateFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  'format' | 'timezone' | keyof BaseDateValidationProps<TDate>
> &
  BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, false, DateValidationError>;
