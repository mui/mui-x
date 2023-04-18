import {
  DesktopTimePickerProps,
  DesktopTimePickerSlotsComponent,
  DesktopTimePickerSlotsComponentsProps,
} from '../DesktopTimePicker';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import {
  MobileTimePickerProps,
  MobileTimePickerSlotsComponent,
  MobileTimePickerSlotsComponentsProps,
} from '../MobileTimePicker';

export interface TimePickerSlotsComponents<
  TDate,
  TView extends TimeViewWithMeridiem | TimeView = TimeViewWithMeridiem,
> extends DesktopTimePickerSlotsComponent<TDate, TView>,
    MobileTimePickerSlotsComponent<TDate, TView> {}

export interface TimePickerSlotsComponentsProps<
  TDate,
  TView extends TimeViewWithMeridiem | TimeView = TimeViewWithMeridiem,
> extends DesktopTimePickerSlotsComponentsProps<TDate, TView>,
    MobileTimePickerSlotsComponentsProps<TDate, TView> {}

export interface TimePickerProps<
  TDate,
  TView extends TimeViewWithMeridiem | TimeView = TimeViewWithMeridiem,
> extends DesktopTimePickerProps<TDate, TView>,
    MobileTimePickerProps<TDate, TView> {
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up("sm")
   */
  desktopModeMediaQuery?: string;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TimePickerSlotsComponents<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimePickerSlotsComponentsProps<TDate, TView>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimePickerSlotsComponents<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotsComponentsProps<TDate, TView>;
}
