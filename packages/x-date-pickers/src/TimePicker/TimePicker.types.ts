import {
  DesktopTimePickerProps,
  DesktopTimePickerSlots,
  DesktopTimePickerSlotProps,
} from '../DesktopTimePicker';
import { TimeViewWithMeridiem } from '../internals/models';
import {
  MobileTimePickerProps,
  MobileTimePickerSlots,
  MobileTimePickerSlotProps,
} from '../MobileTimePicker';
import { FieldTextFieldVersion } from '../models';

export interface TimePickerSlots<TDate>
  extends DesktopTimePickerSlots<TDate>,
    MobileTimePickerSlots<TDate, TimeViewWithMeridiem> {}

export interface TimePickerSlotProps<TDate, TTextFieldVersion extends FieldTextFieldVersion>
  extends DesktopTimePickerSlotProps<TDate, TTextFieldVersion>,
    MobileTimePickerSlotProps<TDate, TimeViewWithMeridiem, TTextFieldVersion> {}

export interface TimePickerProps<TDate, TTextFieldVersion extends FieldTextFieldVersion = 'v6'>
  extends DesktopTimePickerProps<TDate, TTextFieldVersion>,
    Omit<MobileTimePickerProps<TDate, TimeViewWithMeridiem, TTextFieldVersion>, 'views'> {
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
  slots?: TimePickerSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotProps<TDate, TTextFieldVersion>;
}
