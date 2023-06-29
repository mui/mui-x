import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  DesktopDateTimeRangePickerProps,
  DesktopDateTimeRangePickerSlotsComponent,
  DesktopDateTimeRangePickerSlotsComponentsProps,
} from '../DesktopDateTimeRangePicker';
// import {
//   MobileDateRangePickerProps,
//   MobileDateRangePickerSlotsComponent,
//   MobileDateRangePickerSlotsComponentsProps,
// } from '../MobileDateRangePicker';

export interface DateTimeRangePickerSlotsComponents<TDate>
  extends DesktopDateTimeRangePickerSlotsComponent<TDate> {
  // ,MobileDateRangePickerSlotsComponent<TDate>
}

export interface DateTimeRangePickerSlotsComponentsProps<TDate>
  extends DesktopDateTimeRangePickerSlotsComponentsProps<TDate> {
  // ,MobileDateRangePickerSlotsComponentsProps<TDate>
}

export interface DateTimeRangePickerProps<TDate> extends DesktopDateTimeRangePickerProps<TDate> {
  // ,MobileDateRangePickerProps<TDate>
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DateTimeRangePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DateTimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DateTimeRangePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeRangePickerSlotsComponentsProps<TDate>;
}
