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

export interface DateRangePickerSlots<TDate>
  extends DesktopDateRangePickerSlots<TDate>,
    MobileDateRangePickerSlots<TDate> {}

export interface DateRangePickerSlotProps<TDate, TUseV6TextField extends boolean>
  extends DesktopDateRangePickerSlotProps<TDate, TUseV6TextField>,
    MobileDateRangePickerSlotProps<TDate, TUseV6TextField> {}

export interface DateRangePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends DesktopDateRangePickerProps<TDate, TUseV6TextField>,
    MobileDateRangePickerProps<TDate, TUseV6TextField> {
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
  slotProps?: DateRangePickerSlotProps<TDate, TUseV6TextField>;
}
