import {
  DesktopNextDatePickerProps,
  DesktopNextDatePickerSlotsComponent,
  DesktopNextDatePickerSlotsComponentsProps,
} from '../DesktopNextDatePicker';
import {
  MobileNextDatePickerProps,
  MobileNextDatePickerSlotsComponent,
  MobileNextDatePickerSlotsComponentsProps,
} from '../MobileNextDatePicker';

export interface NextDatePickerSlotsComponents<TDate>
  extends DesktopNextDatePickerSlotsComponent<TDate>,
    MobileNextDatePickerSlotsComponent<TDate> {}

export interface NextDatePickerSlotsComponentsProps<TDate>
  extends DesktopNextDatePickerSlotsComponentsProps<TDate>,
    MobileNextDatePickerSlotsComponentsProps<TDate> {}

export interface NextDatePickerProps<TDate>
  extends DesktopNextDatePickerProps<TDate>,
    MobileNextDatePickerProps<TDate> {
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
  components?: NextDatePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: NextDatePickerSlotsComponentsProps<TDate>;
}
