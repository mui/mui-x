import {
  DesktopTimePickerProps,
  DesktopTimePickerSlotsComponent,
  DesktopTimePickerSlotsComponentsProps,
} from '../DesktopTimePicker';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  MobileTimePickerProps,
  MobileTimePickerSlotsComponent,
  MobileTimePickerSlotsComponentsProps,
} from '../MobileTimePicker';

export interface TimePickerSlotsComponents<TDate>
  extends DesktopTimePickerSlotsComponent<TDate>,
    MobileTimePickerSlotsComponent<TDate> {}

export interface TimePickerSlotsComponentsProps<TDate>
  extends DesktopTimePickerSlotsComponentsProps<TDate>,
    MobileTimePickerSlotsComponentsProps<TDate> {}

export interface TimePickerProps<TDate>
  extends DesktopTimePickerProps<TDate>,
    MobileTimePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotsComponentsProps<TDate>;
}
