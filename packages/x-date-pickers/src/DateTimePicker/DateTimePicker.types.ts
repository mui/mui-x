import {
  DesktopDateTimePickerProps,
  DesktopDateTimePickerSlots,
  DesktopDateTimePickerSlotProps,
} from '../DesktopDateTimePicker';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import {
  MobileDateTimePickerProps,
  MobileDateTimePickerSlots,
  MobileDateTimePickerSlotProps,
} from '../MobileDateTimePicker';
import { FieldTextFieldVersion } from '../models';

export interface DateTimePickerSlots<TDate>
  extends DesktopDateTimePickerSlots<TDate>,
    MobileDateTimePickerSlots<TDate, DateOrTimeViewWithMeridiem> {}

export interface DateTimePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends DesktopDateTimePickerSlotProps<TDate, TTextFieldVersion>,
    MobileDateTimePickerSlotProps<TDate, DateOrTimeViewWithMeridiem, TTextFieldVersion> {}

export interface DateTimePickerProps<TDate, TTextFieldVersion extends FieldTextFieldVersion = 'v6'>
  extends DesktopDateTimePickerProps<TDate, TTextFieldVersion>,
    Omit<MobileDateTimePickerProps<TDate, DateOrTimeViewWithMeridiem, TTextFieldVersion>, 'views'> {
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
  slots?: DateTimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateTimePickerSlotProps<TDate, TTextFieldVersion>;
}
