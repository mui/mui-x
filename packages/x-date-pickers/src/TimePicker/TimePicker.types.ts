import {
  DesktopTimePickerProps,
  DesktopTimePickerSlots,
  DesktopTimePickerSlotProps,
} from '../DesktopTimePicker';
import { BaseSingleInputFieldProps, TimeViewWithMeridiem } from '../internals/models';
import {
  MobileTimePickerProps,
  MobileTimePickerSlots,
  MobileTimePickerSlotProps,
} from '../MobileTimePicker';
import { FieldSection, PickerValidDate, TimeValidationError } from '../models';
import { ValidateTimeProps } from '../validation/validateTime';

export interface TimePickerSlots<TDate extends PickerValidDate>
  extends DesktopTimePickerSlots<TDate>,
    MobileTimePickerSlots<TDate, TimeViewWithMeridiem> {}

export interface TimePickerSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DesktopTimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>,
    MobileTimePickerSlotProps<TDate, TimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure> {}

export interface TimePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> extends DesktopTimePickerProps<TDate, TEnableAccessibleFieldDOMStructure>,
    Omit<
      MobileTimePickerProps<TDate, TimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure>,
      'views'
    > {
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
  slots?: TimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
}

/**
 * Props the field can receive when used inside a time picker.
 * (`TimePicker`, `DesktopTimePicker` or `MobileTimePicker` component).
 */
export type TimePickerFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = ValidateTimeProps<TDate> &
  BaseSingleInputFieldProps<
    TDate | null,
    TDate,
    FieldSection,
    TEnableAccessibleFieldDOMStructure,
    TimeValidationError
  >;
