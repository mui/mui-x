import {
  DesktopTimePickerProps,
  DesktopTimePickerSlotsComponent,
  DesktopTimePickerSlotsComponentsProps,
} from '../DesktopTimePicker';
import { BaseResponsivePickerProps } from '../internals';
import { TimeViewWithMeridiem } from '../internals/models';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
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
    Omit<MobileTimePickerProps<TDate, TimeViewWithMeridiem>, 'views'>,
    BaseResponsivePickerProps {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TimePickerSlotsComponents<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimePickerSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimePickerSlotsComponents<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimePickerSlotsComponentsProps<TDate>;
}
