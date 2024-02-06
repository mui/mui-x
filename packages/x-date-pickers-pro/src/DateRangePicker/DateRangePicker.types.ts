import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DesktopDateRangePickerProps,
  DesktopDateRangePickerSlots,
  DesktopDateRangePickerSlotProps,
} from '../DesktopDateRangePicker';
import {
  MobileDateRangePickerProps,
  MobileDateRangePickerSlots,
  MobileDateRangePickerSlotProps,
} from '../MobileDateRangePicker';

export interface DateRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateRangePickerSlots<TDate>,
    MobileDateRangePickerSlots<TDate> {}

export interface DateRangePickerSlotProps<TDate extends PickerValidDate>
  extends DesktopDateRangePickerSlotProps<TDate>,
    MobileDateRangePickerSlotProps<TDate> {}

export interface DateRangePickerProps<TDate extends PickerValidDate>
  extends DesktopDateRangePickerProps<TDate>,
    MobileDateRangePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangePickerSlotProps<TDate>;
}
