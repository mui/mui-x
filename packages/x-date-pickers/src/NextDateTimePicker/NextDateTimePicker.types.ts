import {
  DesktopNextDateTimePickerProps,
  DesktopNextDateTimePickerSlotsComponent,
  DesktopNextDateTimePickerSlotsComponentsProps,
} from '../DesktopNextDateTimePicker';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
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
   * @deprecated
   */
  components?: NextDateTimePickerSlotsComponents<TDate>;
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
  slots?: UncapitalizeObjectKeys<NextDateTimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: NextDateTimePickerSlotsComponentsProps<TDate>;
}
