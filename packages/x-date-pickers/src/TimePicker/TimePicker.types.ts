import {
  DesktopTimePickerProps,
  DesktopTimePickerSlotsComponent,
  DesktopTimePickerSlotsComponentsProps,
} from '../DesktopTimePicker';
import { TimeViewWithMeridiem } from '../internals/models';
import {
  MobileTimePickerProps,
  MobileTimePickerSlotsComponent,
  MobileTimePickerSlotsComponentsProps,
} from '../MobileTimePicker';

export interface TimePickerSlotsComponents<TDate>
  extends DesktopTimePickerSlotsComponent<TDate>,
    MobileTimePickerSlotsComponent<TDate, TimeViewWithMeridiem> {}

export interface TimePickerSlotsComponentsProps<TDate>
  extends DesktopTimePickerSlotsComponentsProps<TDate>,
    MobileTimePickerSlotsComponentsProps<TDate, TimeViewWithMeridiem> {}

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
  slots?: TimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotsComponentsProps<TDate>;
}
