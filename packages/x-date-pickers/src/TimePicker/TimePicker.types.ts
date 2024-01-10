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

export interface TimePickerSlots<TDate>
  extends DesktopTimePickerSlots<TDate>,
    MobileTimePickerSlots<TDate, TimeViewWithMeridiem> {}

export interface TimePickerSlotProps<TDate>
  extends DesktopTimePickerSlotProps<TDate>,
    MobileTimePickerSlotProps<TDate, TimeViewWithMeridiem> {}

export interface TimePickerProps<TDate>
  extends DesktopTimePickerProps<TDate>,
    Omit<MobileTimePickerProps<TDate, TimeViewWithMeridiem>, 'views'> {
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
  slotProps?: TimePickerSlotProps<TDate>;
}
