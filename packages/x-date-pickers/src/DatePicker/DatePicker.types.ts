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
import { FieldTextFieldVersion } from '../models';

export interface DatePickerSlots<TDate>
  extends DesktopDatePickerSlots<TDate>,
    MobileDatePickerSlots<TDate> {}

export interface DatePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends DesktopDatePickerSlotProps<TDate, TTextFieldVersion>,
    MobileDatePickerSlotProps<TDate, TTextFieldVersion> {}

export interface DatePickerProps<TDate, TTextFieldVersion extends FieldTextFieldVersion = 'v6'>
  extends DesktopDatePickerProps<TDate, TTextFieldVersion>,
    MobileDatePickerProps<TDate, TTextFieldVersion> {
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
  slotProps?: DatePickerSlotProps<TDate, TTextFieldVersion>;
}
