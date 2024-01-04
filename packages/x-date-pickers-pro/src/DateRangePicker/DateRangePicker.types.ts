import { FieldTextFieldVersion } from '@mui/x-date-pickers/models';
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

export interface DateRangePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends DesktopDateRangePickerSlotProps<TDate, TTextFieldVersion>,
    MobileDateRangePickerSlotProps<TDate, TTextFieldVersion> {}

export interface DateRangePickerProps<TDate, TTextFieldVersion extends FieldTextFieldVersion = 'v6'>
  extends DesktopDateRangePickerProps<TDate, TTextFieldVersion>,
    MobileDateRangePickerProps<TDate, TTextFieldVersion> {
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
  slotProps?: DateRangePickerSlotProps<TDate, TTextFieldVersion>;
}
