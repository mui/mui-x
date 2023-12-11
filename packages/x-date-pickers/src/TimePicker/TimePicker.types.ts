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

export interface TimePickerSlots<TDate, TUseV6TextField extends boolean>
  extends DesktopTimePickerSlots<TDate, TUseV6TextField>,
    MobileTimePickerSlots<TDate, TimeViewWithMeridiem, TUseV6TextField> {}

export interface TimePickerSlotProps<TDate, TUseV6TextField extends boolean>
  extends DesktopTimePickerSlotProps<TDate, TUseV6TextField>,
    MobileTimePickerSlotProps<TDate, TimeViewWithMeridiem, TUseV6TextField> {}

export interface TimePickerProps<TDate, TUseV6TextField extends boolean = false>
  extends DesktopTimePickerProps<TDate, TUseV6TextField>,
    Omit<MobileTimePickerProps<TDate, TimeViewWithMeridiem, TUseV6TextField>, 'views'> {
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
  slots?: TimePickerSlots<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotProps<TDate, TUseV6TextField>;
}
