import {
  DesktopDatePickerProps,
  DesktopDatePickerSlots,
  DesktopDatePickerSlotProps,
} from '../DesktopDatePicker';
import {
  MobileDatePickerProps,
  MobileDatePickerSlots,
  MobileDatePickerSlotProps,
} from '../MobileDatePicker';

export interface DatePickerSlots<TDate>
  extends DesktopDatePickerSlots<TDate>,
    MobileDatePickerSlots<TDate> {}

export interface DatePickerSlotProps<TDate>
  extends DesktopDatePickerSlotProps<TDate>,
    MobileDatePickerSlotProps<TDate> {}

export interface DatePickerProps<TDate>
  extends DesktopDatePickerProps<TDate>,
    MobileDatePickerProps<TDate> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Years rendered per row.
   * @default 4 on desktop, 3 on mobile
   */
  yearsPerRow?: 3 | 4;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DatePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotProps<TDate>;
}
