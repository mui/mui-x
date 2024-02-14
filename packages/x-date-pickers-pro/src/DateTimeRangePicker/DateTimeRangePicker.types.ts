import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DesktopDateTimeRangePickerProps,
  DesktopDateTimeRangePickerSlots,
  DesktopDateTimeRangePickerSlotProps,
} from '../DesktopDateTimeRangePicker';
import {
  MobileDateTimeRangePickerProps,
  MobileDateTimeRangePickerSlots,
  MobileDateTimeRangePickerSlotProps,
} from '../MobileDateTimeRangePicker';

export interface DateTimeRangePickerSlots<TDate extends PickerValidDate>
  extends DesktopDateTimeRangePickerSlots<TDate>,
    MobileDateTimeRangePickerSlots<TDate> {}

export interface DateTimeRangePickerSlotProps<TDate extends PickerValidDate>
  extends DesktopDateTimeRangePickerSlotProps<TDate>,
    MobileDateTimeRangePickerSlotProps<TDate> {}

export interface DateTimeRangePickerProps<TDate extends PickerValidDate>
  extends DesktopDateTimeRangePickerProps<TDate>,
    MobileDateTimeRangePickerProps<TDate> {
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
  slots?: DateTimeRangePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimeRangePickerSlotProps<TDate>;
}
