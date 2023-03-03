import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  DesktopDateRangePickerProps,
  DesktopDateRangePickerSlotsComponent,
  DesktopDateRangePickerSlotsComponentsProps,
} from '../DesktopDateRangePicker';
import {
  MobileDateRangePickerProps,
  MobileDateRangePickerSlotsComponent,
  MobileDateRangePickerSlotsComponentsProps,
} from '../MobileDateRangePicker';

export interface DateRangePickerSlotsComponents<TDate>
  extends DesktopDateRangePickerSlotsComponent<TDate>,
    MobileDateRangePickerSlotsComponent<TDate> {}

export interface DateRangePickerSlotsComponentsProps<TDate>
  extends DesktopDateRangePickerSlotsComponentsProps<TDate>,
    MobileDateRangePickerSlotsComponentsProps<TDate> {}

export interface DateRangePickerProps<TDate>
  extends DesktopDateRangePickerProps<TDate>,
    MobileDateRangePickerProps<TDate> {
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
  components?: DateRangePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DateRangePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotsComponentsProps<TDate>;
}
