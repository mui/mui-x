import {
  DesktopTimePickerProps,
  DesktopTimePickerSlots,
  DesktopTimePickerSlotProps,
} from '../DesktopTimePicker';
import { TimeViewWithMeridiem } from '../internals/models';
import { DefaultizedProps } from '../internals/models/helpers';
import { BaseTimeValidationProps } from '../internals/models/validation';
import {
  MobileTimePickerProps,
  MobileTimePickerSlots,
  MobileTimePickerSlotProps,
} from '../MobileTimePicker';
import {
  BaseSingleInputFieldProps,
  FieldSection,
  PickerValidDate,
  TimeValidationError,
} from '../models';
import { UseTimeFieldProps } from '../TimeField';

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
> = DefaultizedProps<
  UseTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  'format' | 'timezone' | 'ampm' | keyof BaseTimeValidationProps
> &
  BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, false, TimeValidationError>;
