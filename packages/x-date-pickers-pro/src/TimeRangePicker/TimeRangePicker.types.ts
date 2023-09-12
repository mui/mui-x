import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  DesktopTimeRangePickerProps,
  DesktopTimeRangePickerSlotsComponent,
  DesktopTimeRangePickerSlotsComponentsProps,
} from '../DesktopTimeRangePicker';

export interface TimeRangePickerSlotsComponents<TDate>
  extends DesktopTimeRangePickerSlotsComponent<TDate> {}

export interface TimeRangePickerSlotsComponentsProps<TDate>
  extends DesktopTimeRangePickerSlotsComponentsProps<TDate> {}

export interface TimeRangePickerProps<TDate> extends DesktopTimeRangePickerProps<TDate> {
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
  components?: TimeRangePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimeRangePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimeRangePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeRangePickerSlotsComponentsProps<TDate>;
}
