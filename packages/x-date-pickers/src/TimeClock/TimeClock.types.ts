import { TimeClockClasses } from './timeClockClasses';
import {
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { BaseClockProps, ExportedBaseClockProps } from '../internals/models/props/clock';

export interface ExportedTimeClockProps<TDate> extends ExportedBaseClockProps<TDate> {
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
}

export interface TimeClockSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface TimeClockSlotsComponentsProps extends PickersArrowSwitcherSlotsComponentsProps {}

export interface TimeClockProps<TDate>
  extends ExportedTimeClockProps<TDate>,
    BaseClockProps<TDate> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeClockClasses>;
  /**
   * Overrideable components.
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
   * Overrideable component slots.
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
