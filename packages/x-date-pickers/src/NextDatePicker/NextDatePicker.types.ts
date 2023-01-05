import {
  DesktopNextDatePickerProps,
  DesktopNextDatePickerSlotsComponent,
  DesktopNextDatePickerSlotsComponentsProps,
} from '../DesktopNextDatePicker';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
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
   * @deprecated
   */
  components?: Partial<NextDatePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: NextDatePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<NextDatePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: NextDatePickerSlotsComponentsProps<TDate>;
}
