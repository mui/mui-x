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
import { ValidateTimeProps } from '../validation/validateTime';

export interface TimePickerSlots extends DesktopTimePickerSlots, MobileTimePickerSlots {}

export interface TimePickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends DesktopTimePickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    MobileTimePickerSlotProps<TEnableAccessibleFieldDOMStructure> {}

export interface TimePickerProps<TEnableAccessibleFieldDOMStructure extends boolean = true>
  extends DesktopTimePickerProps<TEnableAccessibleFieldDOMStructure>,
    Omit<MobileTimePickerProps<TimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure>, 'views'> {
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
  slots?: TimePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}

/**
 * Props the field can receive when used inside a Time Picker (<TimePicker />, <DesktopTimePicker /> or <MobileTimePicker /> component).
 */
export type TimePickerFieldProps = ValidateTimeProps & BaseSingleInputFieldProps;
