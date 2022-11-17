import {
  DesktopNextTimePickerProps,
  DesktopNextTimePickerSlotsComponent,
  DesktopNextTimePickerSlotsComponentsProps,
} from '../DesktopNextTimePicker';
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
   */
  components?: NextTimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: NextTimePickerSlotsComponentsProps<TDate>;
}
