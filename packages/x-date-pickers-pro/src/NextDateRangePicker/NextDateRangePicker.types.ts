import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  DesktopNextDateRangePickerProps,
  DesktopNextDateRangePickerSlotsComponent,
  DesktopNextDateRangePickerSlotsComponentsProps,
} from '../DesktopNextDateRangePicker';
import {
  MobileNextDateRangePickerProps,
  MobileNextDateRangePickerSlotsComponent,
  MobileNextDateRangePickerSlotsComponentsProps,
} from '../MobileNextDateRangePicker';

export interface NextDateRangePickerSlotsComponents<TDate>
  extends DesktopNextDateRangePickerSlotsComponent<TDate>,
    MobileNextDateRangePickerSlotsComponent<TDate> {}

export interface NextDateRangePickerSlotsComponentsProps<TDate>
  extends DesktopNextDateRangePickerSlotsComponentsProps<TDate>,
    MobileNextDateRangePickerSlotsComponentsProps<TDate> {}

export interface NextDateRangePickerProps<TDate>
  extends DesktopNextDateRangePickerProps<TDate>,
    MobileNextDateRangePickerProps<TDate> {
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
  components?: NextDateRangePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: NextDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<NextDateRangePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: NextDateRangePickerSlotsComponentsProps<TDate>;
}
