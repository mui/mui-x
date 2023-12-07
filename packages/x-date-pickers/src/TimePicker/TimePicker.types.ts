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

export interface TimePickerSlotsComponents<TDate, TUseV6TextField extends boolean>
  extends DesktopTimePickerSlotsComponent<TDate, TUseV6TextField>,
    MobileTimePickerSlotsComponent<TDate, TimeViewWithMeridiem, TUseV6TextField> {}

export interface TimePickerSlotsComponentsProps<TDate, TUseV6TextField extends boolean>
  extends DesktopTimePickerSlotsComponentsProps<TDate, TUseV6TextField>,
    MobileTimePickerSlotsComponentsProps<TDate, TimeViewWithMeridiem, TUseV6TextField> {}

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
  slots?: TimePickerSlotsComponents<TDate, TUseV6TextField>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotsComponentsProps<TDate, TUseV6TextField>;
}
