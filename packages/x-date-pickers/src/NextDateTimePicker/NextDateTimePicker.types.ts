import {
  DesktopNextDateTimePickerProps,
  DesktopNextDateTimePickerSlotsComponent,
  DesktopNextDateTimePickerSlotsComponentsProps,
} from '../DesktopNextDateTimePicker';
import {
  MobileNextDateTimePickerProps,
  MobileNextDateTimePickerSlotsComponent,
  MobileNextDateTimePickerSlotsComponentsProps,
} from '../MobileNextDateTimePicker';

export interface NextDateTimePickerSlotsComponents<TDate>
  extends DesktopNextDateTimePickerSlotsComponent<TDate>,
    MobileNextDateTimePickerSlotsComponent<TDate> {}

export interface NextDateTimePickerSlotsComponentsProps<TDate>
  extends DesktopNextDateTimePickerSlotsComponentsProps<TDate>,
    MobileNextDateTimePickerSlotsComponentsProps<TDate> {}

export interface NextDateTimePickerProps<TDate>
  extends DesktopNextDateTimePickerProps<TDate>,
    MobileNextDateTimePickerProps<TDate> {
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
  components?: NextDateTimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: NextDateTimePickerSlotsComponentsProps<TDate>;
}
