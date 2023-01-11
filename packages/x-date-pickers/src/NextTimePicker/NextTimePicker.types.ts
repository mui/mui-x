import {
  DesktopNextTimePickerProps,
  DesktopNextTimePickerSlotsComponent,
  DesktopNextTimePickerSlotsComponentsProps,
} from '../DesktopNextTimePicker';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  MobileNextTimePickerProps,
  MobileNextTimePickerSlotsComponent,
  MobileNextTimePickerSlotsComponentsProps,
} from '../MobileNextTimePicker';

export interface NextTimePickerSlotsComponents<TDate>
  extends DesktopNextTimePickerSlotsComponent<TDate>,
    MobileNextTimePickerSlotsComponent<TDate> {}

export interface NextTimePickerSlotsComponentsProps<TDate>
  extends DesktopNextTimePickerSlotsComponentsProps<TDate>,
    MobileNextTimePickerSlotsComponentsProps<TDate> {}

export interface NextTimePickerProps<TDate>
  extends DesktopNextTimePickerProps<TDate>,
    MobileNextTimePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots` with uncapitalized properties.
   */
  components?: NextTimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotsProps`
   */
  componentsProps?: NextTimePickerSlotsComponentsProps<TDate>;
  /**
  * Overrideable component slots.
  * @default {}
   */
  slots?: UncapitalizeObjectKeys<NextTimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: NextTimePickerSlotsComponentsProps<TDate>;
}
