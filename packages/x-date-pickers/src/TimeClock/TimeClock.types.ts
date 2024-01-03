import { TimeClockClasses } from './timeClockClasses';
import {
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';
import { TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

export interface ExportedTimeClockProps<TDate> extends ExportedBaseClockProps<TDate> {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
}

export interface TimeClockSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface TimeClockSlotsComponentsProps extends PickersArrowSwitcherSlotsComponentsProps {}

export interface TimeClockProps<TDate, TView extends TimeViewWithMeridiem = TimeView>
  extends ExportedTimeClockProps<TDate>,
    BaseClockProps<TDate, TView> {
  /**
   * Available views.
   * @default ['hours', 'minutes']
   */
  views?: readonly TView[];
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeClockClasses>;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: TimeClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: TimeClockSlotsComponentsProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<TimeClockSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TimeClockSlotsComponentsProps;
  showViewSwitcher?: boolean;
}
