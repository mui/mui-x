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

export interface DatePickerSlots<TDate, TUseV6TextField extends boolean>
  extends DesktopDatePickerSlots<TDate, TUseV6TextField>,
    MobileDatePickerSlots<TDate, TUseV6TextField> {}

export interface DatePickerSlotProps<TDate, TUseV6TextField extends boolean>
  extends DesktopDatePickerSlotProps<TDate, TUseV6TextField>,
    MobileDatePickerSlotProps<TDate, TUseV6TextField> {}

export interface DatePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends DesktopDatePickerProps<TDate, TUseV6TextField>,
    MobileDatePickerProps<TDate, TUseV6TextField> {
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
  slots?: DatePickerSlots<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DatePickerSlotProps<TDate, TUseV6TextField>;
}
