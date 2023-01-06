import {
  DesktopNextDateTimePickerProps,
  DesktopNextDateTimePickerSlots,
  DesktopNextDateTimePickerSlotsComponent,
  DesktopNextDateTimePickerSlotsComponentsProps,
} from '../DesktopNextDateTimePicker';
import {
  MobileNextDateTimePickerProps,
  MobileNextDateTimePickerSlots,
  MobileNextDateTimePickerSlotsComponent,
  MobileNextDateTimePickerSlotsComponentsProps,
} from '../MobileNextDateTimePicker';

export interface NextDateTimePickerSlots<TDate>
  extends DesktopNextDateTimePickerSlots<TDate>,
    MobileNextDateTimePickerSlots<TDate> {}

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
   * @deprecated
   */
  components?: Partial<NextDateTimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: NextDateTimePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: NextDateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: NextDateTimePickerSlotsComponentsProps<TDate>;
}
